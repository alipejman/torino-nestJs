import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateBlogDto } from "./dto/create-blog.dto";
import { UpdateBlogDto } from "./dto/update-blog.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { BlogEntity } from "./entities/blog.entity";
import { DeepPartial, Repository } from "typeorm";
import { validate } from "class-validator";
import { S3Service } from "../S3/s3.service";
import { TourService } from "../tour/tour.service";
import { sanitizeSlug } from "src/common/utils/slugValidation";
import { PaginationDto } from "src/common/dtos/pagination.dto";
import { paginationGenerator, paginationSolver } from "src/common/utils/pagination.util";
import { title } from "process";

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(BlogEntity)
    private blogRepository: Repository<BlogEntity>,
    private s3Service: S3Service,
    private tourService: TourService
  ) {}

  async create(createBlogDto: CreateBlogDto, images: Express.Multer.File[]) {
    const errors = await validate(createBlogDto);
    if (errors.length > 0) {
      console.error(errors);
      throw new BadRequestException("مقادیر ورودی نامعتبر");
    }
    const imageLocations = [];
    const imageKeys = [];
    for (const image of images) {
      const { Location, Key } = await this.s3Service.uploadFile(
        image,
        "torino-blog-image"
      );
      imageLocations.push(Location);
      imageKeys.push(Key);
    }
    const existingBlog = await this.blogRepository.findOneBy({
      slug: createBlogDto.title,
    });
    if (existingBlog) {
      throw new ConflictException("تور از قبل وجود دارد ❌");
    }
    createBlogDto.slug = this.tourService.generateSlug(createBlogDto.slug);

    const blog = await this.blogRepository.create({
      ...createBlogDto,
      images: imageLocations.join(","),
      imageKeys: imageKeys.join(","),
      slug: sanitizeSlug(createBlogDto.slug),
    });
    try {
      await this.blogRepository.save(blog);
      return {
        message: "blog created successfully ✅",
        blog,
      };
    } catch (error) {
      throw new BadRequestException("خطا در ایجاد مقاله", error.message);
    }
  }


  async findAll(paginationDto: PaginationDto) {
    const {limit, page, skip} = paginationSolver(
      paginationDto.page,
      paginationDto.limit
    )
    const [blog, count] = await this.blogRepository
    .createQueryBuilder("blog")
    .select([
      "blog.id",
      "blog.title",
      "blog.description",
      "blog.images",
      "blog.text",
      "blog.updatedAt"
    ])
    .skip(skip)
    .take(limit)
    .orderBy("blog.id", "DESC")
    .getManyAndCount()

    return {
      pagination: paginationGenerator(count, page, limit),
      blog
    }
  }

  async findOne(id: number) {
    const blog = await this.blogRepository.findOne({
        where: { id },
        relations: {
          comments: {
            user: {
              profile: true
            }
          }
        },
        select: {
            id: true,
            comments: {
                id: true,
                text: true,
                user: {
                  id: true,
                  profile: {
                    firstname:true,
                    lastname: true
                  }
                }
            },
        },
    });

    if (!blog) throw new NotFoundException("blog not found !");
    return {
        blog,
    };
}


  async findOneBySlug(slug: string) {
    const blog = await this.blogRepository.findOne({
      where: {slug},
      relations:{
        comments: true
      },
      select: {
        comments: {
          id: true,
          text: true
        }
      }
    })
    if(!slug) {
      throw new NotFoundException("blog not Found!");
    }
    return blog;
  }

  async update(id: number, updateBlogDto: UpdateBlogDto, images: Express.Multer.File[]) {
    const blog = await this.blogRepository.findOneBy({id});
    if(!blog) {
      throw new NotFoundException("blog is not found!");
    }
    const updateBlogObject: DeepPartial<BlogEntity> = {}
    const {description, slug, text, title} = updateBlogDto;
    if (images && images.length > 0) {
      const imageLocations = [];
      const imageKeys = [];
  
      for (const image of images) {
        const { Location, Key } = await this.s3Service.uploadFile(
          image,
          "torino-blog-image"
        );
        imageLocations.push(Location);
        imageKeys.push(Key);
      }
  
      updateBlogObject["images"] = imageLocations.join(',');
      updateBlogObject["imageKeys"] = imageKeys.join(',');
  
      if (blog?.imageKeys) {
        const oldImageKeys = blog.imageKeys.split(',');
        for (const key of oldImageKeys) {
          await this.s3Service.deleteFile(key);
        }
      }
    }
    if(title) {
      await this.blogRepository.findOneBy({title});
      if(title) throw new ConflictException("title before used please re-write title ! ");
      updateBlogObject["title"] = title
    }
    if(slug) {
      updateBlogObject["slug"] = sanitizeSlug(slug)
    }
    if(text) updateBlogObject["text"] = text;
    if(description) updateBlogObject["description"] = description;
    await this.blogRepository.update({id}, updateBlogObject);
    return {
      message: "Blog Updated successfully ✅"
    }
  }

  remove(id: number) {
    return `This action removes a #${id} blog`;
  }
}
