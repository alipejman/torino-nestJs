import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateTourDto } from "./dto/create-tour.dto";
import { UpdateTourDto } from "./dto/update-tour.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { TourEntity } from "./entities/tour.entity";
import { DeepPartial, Repository } from "typeorm";
import { validate } from "class-validator";
import { json } from "stream/consumers";
import slugify from "slugify";
import { sanitizeSlug } from "src/common/utils/slugValidation";
import { S3Service } from "../S3/s3.service";
import { PaginationDto } from "src/common/dtos/pagination.dto";
import {
  paginationGenerator,
  paginationSolver,
} from "src/common/utils/pagination.util";

@Injectable()
export class TourService {
  constructor(
    @InjectRepository(TourEntity)
    private tourRepository: Repository<TourEntity>,
    private s3Service: S3Service
  ) {}

  private generateSlug(title: string): string {
    return slugify(title, {
      lower: true,
      replacement: "-",
      remove: undefined,
      trim: true,
    });
  }

  async create(
    createTourDto: CreateTourDto,
    image: Express.Multer.File
  ): Promise<TourEntity> {
    const errors = await validate(createTourDto);
    if (errors.length > 0) {
      console.error(errors);
      throw new BadRequestException("مقادیر ورودی نامعتبر");
    }
    const { Location, Key } = await this.s3Service.uploadFile(
      image,
      "torino-tour-image"
    );
    const existingTour = await this.tourRepository.findOneBy({
      title: createTourDto.title,
    });
    if (existingTour) {
      throw new ConflictException("تور از قبل وجود دارد ❌");
    }

    createTourDto.slug = this.generateSlug(createTourDto.title);

    const tour = this.tourRepository.create({
      ...createTourDto,
      image: Location,
      imageKey: Key,
      slug: sanitizeSlug(createTourDto.slug),
      start_date: new Date(createTourDto.start_date),
      end_date: new Date(createTourDto.end_date),
    });

    try {
      return await this.tourRepository.save(tour);
    } catch (error) {
      throw new BadRequestException("حطا در ایجاد تور", error.message);
    }
  }

  async findAll(pagination: PaginationDto) {
    const { limit, page, skip } = paginationSolver(
      pagination.page,
      pagination.limit
    );

    const [tour, count] = await this.tourRepository
      .createQueryBuilder("tour")
      .select([
        "tour.id",
        "tour.createdAt",
        "tour.updatedAt",
        "tour.title",
        "tour.description",
        "tour.slug",
        "tour.image",
        "tour.origin",
        "tour.destination",
        "tour.start_date",
        "tour.end_date",
        "tour.transport_type",
        "tour.capacity",
        "tour.insurance",
        "tour.leader",
        "tour.status",
      ])
      .skip(skip)
      .take(limit)
      .orderBy("tour.id", "DESC")
      .getManyAndCount();

    return {
      pagination: paginationGenerator(count, page, limit),
      tour,
    };
  }

  async findOne(id: number) {
    const tour = await this.tourRepository.findOneBy({ id });
    if (!tour) throw new NotFoundException("tour not found !");
    return tour;
  }

  async findOneBySlug(slug: string) {
    const tour = await this.tourRepository.findOneBy({ slug });
    if (!tour) {
      throw new NotFoundException("tour not found !");
    }
    return tour;
  }

  async update(
    id: number,
    updateTourDto: UpdateTourDto,
    image: Express.Multer.File
  ) {
    const {
      title,
      capacity,
      description,
      destination,
      end_date,
      insurance,
      leader,
      origin,
      slug,
      start_date,
      status,
      transport_type,
    } = updateTourDto;
    const tour = await this.findOne(id);
    const updateTourObject: DeepPartial<TourEntity> = {};
    if (image) {
      const { Location, Key } = await this.s3Service.uploadFile(
        image,
        "torino-tour-image"
      );
      if (Location) {
        (updateTourObject["image"] = Location),
          (updateTourObject["imageKey"] = Key);
        if (tour?.imageKey) {
          await this.s3Service.deleteFile(tour?.imageKey);
        }
      }
    }

    if (title) updateTourObject["title"] = title;
    if (capacity) updateTourObject["capacity"] = capacity;
    if (slug) {
      const tour = await this.tourRepository.findOneBy({ slug });
      if (tour && tour.id !== id)
        throw new ConflictException("already exist category slug");
      updateTourObject["slug"] = slug;
    }
    if (end_date) updateTourObject["end_date"] = end_date;
    if (start_date) updateTourObject["start_date"] = start_date;
    if (description) updateTourObject["description"] = description;
    if (origin) updateTourObject["origin"] = origin;
    if (destination) updateTourObject["destination"] = destination;
    if (leader) updateTourObject["leader"] = leader;
    if (insurance) updateTourObject["insurance"] = insurance;
    if (status) updateTourObject["status"] = status;
    if (transport_type) updateTourObject["transport_type"] = transport_type;

    await this.tourRepository.update({ id }, updateTourObject);
    const newTour = await this.tourRepository.findOneBy({ id });
    return {
      message: "tour Updated successfully ✅",
      newTour,
    };
  }

  async remove(id: number) {
    const tour = await this.findOne(id);
    if (tour.imageKey) {
      await this.s3Service.deleteFile(tour.imageKey);
    }
    await this.tourRepository.delete({ id });
    return {
      message: "Tour deleted successfully ✅",
    };
  }
}
