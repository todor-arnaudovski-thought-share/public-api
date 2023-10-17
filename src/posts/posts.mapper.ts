import { Post } from 'src/posts/post.schema';
import { PostDto } from './dto/post.dto';
import { User } from 'src/users/user.schema';
import { Document } from 'mongoose';
import { mapUserToDto } from 'src/users/user.mapper';
import { UserDto } from 'src/users/dto/user.dto';

export function mapPostToDto(post: Post): PostDto {
  const { createdAt, pubId, content, createdBy, upvotedBy } = post;

  let mappedCreatedBy: UserDto;
  let mappedUpvotedBy: UserDto[];

  if (createdBy instanceof Document) {
    mappedCreatedBy = mapUserToDto(createdBy as User);
  }

  if (
    Array.isArray(upvotedBy) &&
    upvotedBy.length > 0 &&
    upvotedBy[0] instanceof Document
  ) {
    mappedUpvotedBy = (upvotedBy as User[]).map((user) => {
      return mapUserToDto(user);
    });
  }

  const postDto: PostDto = {
    createdAt,
    pubId,
    content,
    createdBy: mappedCreatedBy,
    upvotedBy: mappedUpvotedBy,
  };

  return postDto;
}
