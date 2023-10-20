import {
  Injectable,
  Logger,
  InternalServerErrorException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Post } from '../posts/schemas/post.schema';

@Injectable()
export class UsersRepository {
  private logger = new Logger();

  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findAll(): Promise<User[]> {
    try {
      return await this.userModel.find().populate('upvotedPosts').exec();
    } catch (err) {
      this.logger.error('Error fetching all users', err);
      throw new InternalServerErrorException();
    }
  }

  async findByUsername(username: string): Promise<User> {
    try {
      return await this.userModel
        .findOne({ username })
        .populate('upvotedPosts')
        .exec();
    } catch (err) {
      throw new InternalServerErrorException();
    }
  }

  async create(username: string, password: string): Promise<User> {
    try {
      const createdUser = new this.userModel({
        username,
        password,
      });

      return await createdUser.save();
    } catch (err) {
      if (err.code === 11000) {
        throw new ConflictException('Username already exists');
      }
      throw new InternalServerErrorException();
    }
  }

  async addUpvotedPost(user: User, post: Post): Promise<void> {
    try {
      await this.userModel.updateOne(
        { pubId: user.pubId },
        {
          $addToSet: { upvotedPosts: post },
        },
      );
    } catch (err) {
      this.logger.error('Error addning upvoted post to user', err);
      throw new InternalServerErrorException();
    }
  }

  async removeUpvotedPost(user: User, post: Post): Promise<void> {
    try {
      await this.userModel.updateOne(
        { pubId: user.pubId },
        {
          $pull: { upvotedPosts: post._id },
        },
      );
    } catch (err) {
      this.logger.error('Error removing upvoted post from user', err);
      throw new InternalServerErrorException();
    }
  }
}
