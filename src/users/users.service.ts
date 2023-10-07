import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { User } from './user.schema';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  async findAll(): Promise<User[]> {
    return await this.usersRepository.findAll();
  }
}
