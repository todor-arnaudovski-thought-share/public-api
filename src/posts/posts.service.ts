import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Post } from './post.schema';
import { CreatePostDto } from './dto/create-post.dto';
import { User } from 'src/users/user.schema';
import { PostsRepository } from './posts.repository';
import { mapPostToDto } from './posts.mapper';
import { PostDto } from './dto/post.dto';
import { UsersRepository } from 'src/users/users.repository';

@Injectable()
export class PostsService {
  private logger = new Logger('PostsService');

  constructor(
    private readonly postsRepository: PostsRepository,
    private readonly usersRepository: UsersRepository,
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
    await this.usersRepository.addUpvotedPost(user, post);

    const postDto = mapPostToDto(post);
    return postDto;
  }

  async downvote(postPubId: string, user: User): Promise<PostDto> {
    const post = await this.postsRepository.downvote(postPubId, user);
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    // remove post from upvotedPosts in user
    await this.usersRepository.removeUpvotedPost(user, post);

    const postDto = mapPostToDto(post);
    return postDto;
  }
}
