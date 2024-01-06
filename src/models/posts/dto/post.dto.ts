import { IsNotEmpty, IsString } from 'class-validator';
import { UserPublicDto } from '../../users/dto/user-public.dto';

export class PostDto {
  createdAt: Date;

  pubId: string;

  @IsString()
  content: string;

  @IsNotEmpty()
  createdBy: UserPublicDto;

  upvotedBy: UserPublicDto[];
}
