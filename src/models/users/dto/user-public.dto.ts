import { IsString } from 'class-validator';
import { PostDto } from '../../posts/dto/post.dto';

export class UserPublicDto {
  @IsString()
  pubId: string;

  @IsString()
  username: string;

  upvotedPosts?: PostDto[];
}
