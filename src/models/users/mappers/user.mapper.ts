import { PostDto } from '../../posts/dto/post.dto';
import { Post } from '../../posts/schemas/post.schema';
import { mapPostToDto } from '../../posts/mappers/posts.mapper';
import { UserDto } from '../dto/user.dto';
import { User } from '../schemas/user.schema';
import { Document } from 'mongoose';

export function mapUserToDto(user: User): UserDto {
  const { pubId, username, upvotedPosts } = user;

  let mappedUpvotedPosts: PostDto[];

  const userDto: UserDto = {
    pubId,
    username,
  };

  if (
    Array.isArray(upvotedPosts) &&
    upvotedPosts.length > 0 &&
    upvotedPosts[0] instanceof Document
  ) {
    // in case we don't need upvoted posts of users that upvoted a post:
    // post > upvotedBy > upvotedPosts - we don't need that
    mappedUpvotedPosts = (upvotedPosts as Post[]).map((post) => {
      return mapPostToDto(post);
    });
    if (mappedUpvotedPosts) userDto.upvotedPosts = mappedUpvotedPosts;
  }

  return userDto;
}
