import { BadRequestException, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateBannerDto } from "./dto/create-banner.dto";
import { BannerEntity } from "./entities/banner.entity";
import { S3Service } from "../S3/s3.service";

@Injectable()
export class BannerService {
  private readonly logger = new Logger(BannerService.name);

  constructor(
    @InjectRepository(BannerEntity)
    private readonly bannerRepository: Repository<BannerEntity>,
    private readonly s3Service: S3Service,

  ) {}

 async setBanner(createBannerDto: CreateBannerDto, image?: Express.Multer.File) {
  try {
    const { title, phone, description, button_link, button_color, isActivate } = createBannerDto;

    let banner = await this.bannerRepository.findOne({ where: { id: 1 } });

    if (!banner) {
      banner = await this.bannerRepository.create({
        title,
        phone,
        description,
        button_link,
        button_color,
        isActivate,
      });
      if (image) {
        if (banner.image_key) {
          await this.s3Service.deleteFile(banner.image_key).catch((err) => {
            this.logger.error(`Failed to delete old image: ${err.message}`);
          });
        }
  
        const { Location, Key } = await this.s3Service.uploadFile(image, "torino-banner-image");
  
        banner.image = Location;
        banner.image_key = Key;
      }
      await this.bannerRepository.save(banner)
      return {
        message: "Banner Created successfully ✅"
      }
    }
    if (image) {
      if (banner.image_key) {
        await this.s3Service.deleteFile(banner.image_key).catch((err) => {
          this.logger.error(`Failed to delete old image: ${err.message}`);
        });
      }

      const { Location, Key } = await this.s3Service.uploadFile(image, "torino-banner-image");

      banner.image = Location;
      banner.image_key = Key;
    }

    banner.title = title;
    banner.phone = phone;
    banner.description = description;
    banner.button_link = button_link;
    banner.button_color = button_color;
    banner.isActivate = isActivate;

    await this.bannerRepository.save(banner);
    return {
      message: "Banner updated successfully ✅",
      banner,
    };
  } catch (error) {
    this.logger.error(`Error in setBanner: ${error.message}`, error.stack);
    throw new BadRequestException(error.message);
  }
}
}