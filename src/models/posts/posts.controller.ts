import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { Post as PostModel } from './schemas/post.schema';
import { PostDto } from './dto/post.dto';
import { User } from '../users/schemas/user.schema';
import { GetUser } from '../../common/decorators/requests/get-user.decorator';
import { JwtAuthGuard } from '../../common/guards/auth/jwt-auth.guard';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Get()
  async findAll(): Promise<PostDto[]> {
    return await this.postsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createPostDto: CreatePostDto,
    @GetUser() user: User,
  ): Promise<PostModel> {
    return this.postsService.create(createPostDto, user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/upvote')
  async upvote(
    @Param('id') postPubId: string,
    @GetUser() user: User,
  ): Promise<PostDto> {
    return await this.postsService.upvote(postPubId, user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/downvote')
  async downvote(
    @Param('id') postPubId: string,
    @GetUser() user: User,
  ): Promise<PostDto> {
    return await this.postsService.downvote(postPubId, user);
  }
}
