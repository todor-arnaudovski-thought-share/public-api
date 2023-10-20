import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Post } from './schemas/post.schema';
import { CreatePostDto } from './dto/create-post.dto';
import { PostsRepository } from './posts.repository';
import { mapPostToDto } from './mappers/posts.mapper';
import { PostDto } from './dto/post.dto';
import { User } from '../users/schemas/user.schema';
import { UsersService } from '../users/users.service';

@Injectable()
export class PostsService {
  private logger = new Logger('PostsService');

  constructor(
    private readonly postsRepository: PostsRepository,
    private readonly usersService: UsersService,
  ) {}

  async findAll(): Promise<PostDto[]> {
    const posts = await this.postsRepository.findAll();
    const postDtos = posts.map((post) => mapPostToDto(post));
    return postDtos;
  }

  async create(createPostDto: CreatePostDto, user: User): Promise<Post> {
    return await this.postsRepository.create(createPostDto, user);
  }

  async upvote(postPubId: string, user: User): Promise<PostDto> {
    const post = await this.postsRepository.upvote(postPubId, user);
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    // add post to upvotedPosts in user
    await this.usersService.addUpvotedPost(user, post);

    const postDto = mapPostToDto(post);
    return postDto;
  }

  async downvote(postPubId: string, user: User): Promise<PostDto> {
    const post = await this.postsRepository.downvote(postPubId, user);
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    // remove post from upvotedPosts in user
    await this.usersService.removeUpvotedPost(user, post);

    const postDto = mapPostToDto(post);
    return postDto;
  }
}
