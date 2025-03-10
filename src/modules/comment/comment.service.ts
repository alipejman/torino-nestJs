import { Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { CreateCommentBlogDto, CreateCommentDto } from './dto/create-comment.dto';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { TourService } from '../tour/tour.service';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentEntity } from './entities/comment.entity';
import { Repository } from 'typeorm';
import { BlogService } from '../blog/blog.service';

@Injectable({scope: Scope.REQUEST})
export class CommentService {
  constructor(
    @Inject(REQUEST) private request: Request,
    private tourService: TourService,
    private blogService: BlogService,
    @InjectRepository(CommentEntity) private commentRepository: Repository<CommentEntity>,
  ) {}

  async create(createCommentDto: CreateCommentDto) {
    const {text, tourId} = createCommentDto;
    const {id: userId} = this.request.user;
    const tour = await this.tourService.findOne(tourId);
    await this.commentRepository.insert({
      text,
      tourId,
      userId,
    })
    return {
      message: "comment created successfully✅"
    }
  }

  async createForBlog(createCommentBlogDto: CreateCommentBlogDto) {
    const {text, blogId} = createCommentBlogDto;
    const {id: userId} = this.request.user;
    const blog = await this.blogService.findOne(blogId);
    await this.commentRepository.insert({
      text,
      blogId,
      userId,
    })
    return {
      message: "comment created successfully✅"
    }
  }


  async remove(id: number) {
    const tour = await this.commentRepository.findOneBy({id});
    if(!tour) {
      throw new NotFoundException("tour not found !");
    };
    await this.commentRepository.delete({id});
    return {
      message: `comments id ${id} deleted successfully ✅`
    }
  }
}
