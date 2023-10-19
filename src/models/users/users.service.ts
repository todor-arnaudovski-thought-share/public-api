import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { mapUserToDto } from './mappers/user.mapper';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  async findAll(): Promise<UserDto[]> {
    const users = await this.usersRepository.findAll();
    const userDtos = users.map((user) => mapUserToDto(user));
    return userDtos;
  }
}
