import { PostDto } from 'src/posts/dto/post.dto';

export class UserDto {
  pubId: string;
  username: string;
  upvotedPosts?: PostDto[];
}
