import { PostDto } from '../dto/post.dto';
import { Document } from 'mongoose';
import { Post } from '../schemas/post.schema';
import { UserDto } from '../../users/dto/user.dto';
import { mapUserToDto } from '../../users/mappers/user.mapper';
import { User } from '../../users/schemas/user.schema';

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
