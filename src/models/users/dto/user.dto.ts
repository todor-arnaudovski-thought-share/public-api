import { PostDto } from '../../posts/dto/post.dto';

export class UserDto {
  pubId: string;
  username: string;
  upvotedPosts?: PostDto[];
}
