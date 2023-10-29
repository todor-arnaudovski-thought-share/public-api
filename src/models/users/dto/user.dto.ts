import { IsString } from 'class-validator';
import { PostDto } from '../../posts/dto/post.dto';

export class UserDto {
  @IsString()
  pubId: string;

  @IsString()
  username: string;

  upvotedPosts?: PostDto[];
}
