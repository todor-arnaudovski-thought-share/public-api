import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { mapUserToDto } from './mappers/user.mapper';
import { UserDto } from './dto/user.dto';
import { User } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { AuthCredentialsDto } from '../../auth/dto/auth-credentials.dto';
import { Post } from '../posts/schemas/post.schema';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  async updateRtHash(pubId: string, hashedRt: string): Promise<void> {
    await this.usersRepository.updateRtHash(pubId, hashedRt);
  }

  async removeRtHash(pubId: string): Promise<void> {
    await this.usersRepository.removeRtHash(pubId);
  }

  async findAll(): Promise<UserDto[]> {
    const users = await this.usersRepository.findAll();
    const userDtos = users.map((user) => mapUserToDto(user));
    return userDtos;
  }

  async findByUsername(username: string): Promise<User> {
    return await this.usersRepository.findByUsername(username);
  }

  async findByPubId(pubId: string): Promise<User> {
    return await this.usersRepository.findByPubId(pubId);
  }

  async create(authCredentialsDto: AuthCredentialsDto): Promise<User> {
    const { username, password } = authCredentialsDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    return await this.usersRepository.create(username, hashedPassword);
  }

  async addUpvotedPost(user: User, post: Post): Promise<void> {
    await this.usersRepository.addUpvotedPost(user, post);
  }

  async removeUpvotedPost(user: User, post: Post): Promise<void> {
    await this.usersRepository.removeUpvotedPost(user, post);
  }
}
