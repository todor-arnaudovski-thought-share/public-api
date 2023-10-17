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
import { Post as PostModel } from './post.schema';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/users/get-user.decorator';
import { User } from 'src/users/user.schema';
import { PostDto } from './dto/post.dto';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Get()
  async findAll(): Promise<PostDto[]> {
    return await this.postsService.findAll();
  }

  @UseGuards(AuthGuard())
  @Post()
  async create(
    @Body() createPostDto: CreatePostDto,
    @GetUser() user: User,
  ): Promise<PostModel> {
    return this.postsService.create(createPostDto, user);
  }

  @UseGuards(AuthGuard())
  @Patch(':id/upvote')
  async upvote(
    @Param('id') postPubId: string,
    @GetUser() user: User,
  ): Promise<PostDto> {
    return await this.postsService.upvote(postPubId, user);
  }

  @UseGuards(AuthGuard())
  @Patch(':id/downvote')
  async downvote(
    @Param('id') postPubId: string,
    @GetUser() user: User,
  ): Promise<PostDto> {
    return await this.postsService.downvote(postPubId, user);
  }
}
