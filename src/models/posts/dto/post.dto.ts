import { UserDto } from '../../users/dto/user.dto';

export class PostDto {
  createdAt: Date;
  pubId: string;
  content: string;
  createdBy: UserDto;
  upvotedBy: UserDto[];
}
