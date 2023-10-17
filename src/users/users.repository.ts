import {
  Injectable,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import { Post } from 'src/posts/post.schema';

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
