import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateTourDto } from "./dto/create-tour.dto";
import { UpdateTourDto } from "./dto/update-tour.dto";
import { InjectRepository } from "@nestjs/typeorm";
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
import { TourEntity } from "./entities/tour.entity";
import { UserEntity } from "../user/entities/user.entity";
import { TourStatusEnum } from "./enum/tour.enum";

@Injectable()
export class TourService {
  constructor(
    @InjectRepository(TourEntity)
    private tourRepository: Repository<TourEntity>,
    private s3Service: S3Service
  ) {}

   generateSlug(title: string): string {
    return slugify(title, {
      lower: true,
      replacement: "-",
      remove: undefined,
      trim: true,
    });
  }

  async create(
    createTourDto: CreateTourDto,
    images: Express.Multer.File[],
  ): Promise<TourEntity> {
    const errors = await validate(createTourDto);
    if (errors.length > 0) {
      console.error(errors);
      throw new BadRequestException("مقادیر ورودی نامعتبر");
    }

    const imageLocations = [];
    const imageKeys = [];

    for (const image of images) {
      const { Location, Key } = await this.s3Service.uploadFile(
        image,
        "torino-tour-image"
      );
      imageLocations.push(Location);
      imageKeys.push(Key);
    }

    const existingTour = await this.tourRepository.findOneBy({
      title: createTourDto.title,
    });
    if (existingTour) {
      throw new ConflictException("تور از قبل وجود دارد ❌");
    }

    if(!createTourDto.slug) {
      createTourDto.slug = this.generateSlug(createTourDto.title)
    }
    const tour = this.tourRepository.create({
      ...createTourDto,
      images: imageLocations.join(','),
      imageKeys: imageKeys.join(','),
      slug: sanitizeSlug(createTourDto.slug),
      start_date: new Date(createTourDto.start_date),
      end_date: new Date(createTourDto.end_date),
    });

    try {
      return await this.tourRepository.save(tour);
    } catch (error) {
      throw new BadRequestException("خطا در ایجاد تور", error.message);
    }
  }
  

  async findAll(pagination: PaginationDto) {
    const { limit, page, skip } = paginationSolver(
      pagination.page,
      pagination.limit
    );

    const [tour, count] = await this.tourRepository
      .createQueryBuilder("tour")
      .where('tour."reserved" < tour."capacity"')
      .andWhere('tour."status" = :status', {status: TourStatusEnum.InProgress})
      .select([
        "tour.id",
        "tour.createdAt",
        "tour.updatedAt",
        "tour.title",
        "tour.description",
        "tour.slug",
        "tour.images",
        "tour.origin",
        "tour.destination",
        "tour.start_date",
        "tour.end_date",
        "tour.transport_type",
        "tour.capacity",
        "tour.reserved",
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
    const tour = await this.tourRepository.findOne({
      where: {id},
      relations: {
        comments: {user: {
          profile: true
        }}
      },
      select: {
        comments: {
          id: true,
          text: true,
          user: {
            id: true,
            profile: {
              firstname: true,
              lastname: true
            }
          }
        },
        
      }
    });
    if (!tour) throw new NotFoundException("tour not found !");
    return {
      tour
    };
  }

    async findOneBySlug(slug: string) {
        const tour = await this.tourRepository.findOne({
            where: { slug },
            relations: {
                comments: {
                    user: {
                        profile: true,
                    }
                }
            },
            select: {
                comments: {
                    id: true,
                    text: true,
                    user: {
                        id: true,
                        profile: {
                            firstname: true,
                            lastname: true,
                        }
                    }
                }
            }
        })
    if (!tour) {
      throw new NotFoundException("tour not found !");
    }
    return tour;
  }

  async checkTourById(id:number) {
    const tour = await this.tourRepository.findOneBy({id});
    if(!tour) {
      throw new NotFoundException("not found tour !");
    }
    return tour;
  }

  async update(
    id: number,
    updateTourDto: UpdateTourDto,
    images: Express.Multer.File[], 
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
  
    const tour = await this.checkTourById(id);
    const updateTourObject: DeepPartial<TourEntity> = {};
  
    if (images && images.length > 0) {
      const imageLocations = [];
      const imageKeys = [];
  
      for (const image of images) {
        const { Location, Key } = await this.s3Service.uploadFile(
          image,
          "torino-tour-image"
        );
        imageLocations.push(Location);
        imageKeys.push(Key);
      }
  
      updateTourObject["images"] = imageLocations.join(',');
      updateTourObject["imageKeys"] = imageKeys.join(',');
  
      if (tour?.imageKeys) {
        const oldImageKeys = tour.imageKeys.split(',');
        for (const key of oldImageKeys) {
          await this.s3Service.deleteFile(key);
        }
      }
    }
  
    if (title) updateTourObject["title"] = title;
    if (capacity) updateTourObject["capacity"] = capacity;
    if (slug) {
      const existingTour = await this.tourRepository.findOneBy({ slug });
      if (existingTour && existingTour.id !== id) {
        throw new ConflictException("اسلاگ تور از قبل وجود دارد ❌");
      }
      updateTourObject["slug"] = sanitizeSlug(slug);
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
    const updatedTour = await this.tourRepository.findOneBy({ id });
  
    return {
      message: "تور با موفقیت به‌روزرسانی شد ✅",
      updatedTour,
    };
  }

  async remove(id: number) {
    const tour = await this.checkTourById(id)
  
    if (tour.imageKeys) {
      const imageKeys = tour.imageKeys.split(',');
      for (const key of imageKeys) {
        await this.s3Service.deleteFile(key);
      }
    }
  
    await this.tourRepository.delete({ id });
  
    return {
      message: "تور با موفقیت حذف شد ✅",
    };
  }
}
