import { IsNotEmpty, IsString } from 'class-validator';
import { UserDto } from '../../users/dto/user.dto';

export class PostDto {
  createdAt: Date;

  pubId: string;

  @IsString()
  content: string;

  @IsNotEmpty()
  createdBy: UserDto;

  upvotedBy: UserDto[];
}
