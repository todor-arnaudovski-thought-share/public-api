import { Injectable, Logger } from '@nestjs/common';
import { Post } from './post.schema';
import { CreatePostDto } from './dto/create-post.dto';
import { User } from 'src/users/user.schema';
import { PostsRepository } from './posts.repository';

@Injectable()
export class PostsService {
  private logger = new Logger('PostsService');

  constructor(private readonly postsRepository: PostsRepository) {}

  async findAll(): Promise<Post[]> {
    return await this.postsRepository.findAll();
  }

  async create(createPostDto: CreatePostDto, user: User): Promise<Post> {
    return await this.postsRepository.create(createPostDto, user);
  }

  async upvote(postId: string, user: User): Promise<Post> {
    return await this.postsRepository.upvote(postId, user);
  }
}
