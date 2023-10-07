import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { Post as PostModel } from './post.schema';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/users/get-user.decorator';
import { User } from 'src/users/user.schema';
import { PostsInterceptor } from './posts.interceptor';

@Controller('posts')
@UseGuards(AuthGuard())
@UseInterceptors(PostsInterceptor)
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Get()
  async findAll(): Promise<PostModel[]> {
    return await this.postsService.findAll();
  }

  @Post()
  async create(
    @Body() createPostDto: CreatePostDto,
    @GetUser() user: User,
  ): Promise<PostModel> {
    return this.postsService.create(createPostDto, user);
  }

  @Patch(':id')
  async upvote(
    @Param('id') postId: string,
    @GetUser() user: User,
  ): Promise<PostModel> {
    return await this.postsService.upvote(postId, user);
  }
}
