import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserPublicDto } from './dto/user-public.dto';
import { JwtAuthGuard } from '../../common/guards/auth';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(): Promise<UserPublicDto[]> {
    return await this.usersService.findAll();
  }
}
