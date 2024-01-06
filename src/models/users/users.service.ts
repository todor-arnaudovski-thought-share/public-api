import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { mapUserToDto } from './mappers/user.mapper';
import { UserPublicDto } from './dto/user-public.dto';
import { User } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { Post } from '../posts/schemas/post.schema';
import { RegisterUserDto } from '../../auth/dto';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  async updateRtHash(pubId: string, hashedRt: string): Promise<void> {
    await this.usersRepository.updateRtHash(pubId, hashedRt);
  }

  async removeRtHash(pubId: string): Promise<void> {
    await this.usersRepository.removeRtHash(pubId);
  }

  async findAll(): Promise<UserPublicDto[]> {
    const users = await this.usersRepository.findAll();
    const UsersPublicDtos = users.map((user) => mapUserToDto(user));
    return UsersPublicDtos;
  }

  async findByEmail(email: string): Promise<User> {
    return await this.usersRepository.findByEmail(email);
  }

  async findByPubId(pubId: string): Promise<User> {
    return await this.usersRepository.findByPubId(pubId);
  }

  async create(registerUserDto: RegisterUserDto): Promise<User> {
    const { email, username, password } = registerUserDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    return await this.usersRepository.create(email, username, hashedPassword);
  }

  async addUpvotedPost(user: User, post: Post): Promise<void> {
    await this.usersRepository.addUpvotedPost(user, post);
  }

  async removeUpvotedPost(user: User, post: Post): Promise<void> {
    await this.usersRepository.removeUpvotedPost(user, post);
  }

  async markEmailAsVerified(email: string) {
    return this.usersRepository.markEmailAsVerified(email);
  }
}
