import {
  Injectable,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument } from './post.schema';
import { CreatePostDto } from './dto/create-post.dto';
import { User } from 'src/users/user.schema';

@Injectable()
export class PostsRepository {
  private logger = new Logger();

  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {}

  async findAll(): Promise<Post[]> {
    try {
      return await this.postModel
        .find()
        .populate('createdBy upvotedBy')
        .sort({ createdAt: -1 })
        .exec();
    } catch (err) {
      this.logger.error('Error fetching all posts', err);
      throw new InternalServerErrorException();
    }
  }

  async create(createPostDto: CreatePostDto, user: User): Promise<Post> {
    try {
      return await this.postModel.create({
        ...createPostDto,
        createdBy: user,
      });
    } catch (err) {
      this.logger.error('Error creating post', err);
      throw new InternalServerErrorException();
    }
  }

  async upvote(postPubId: string, user: User): Promise<Post> {
    try {
      return await this.postModel
        .findOneAndUpdate(
          { pubId: postPubId },
          {
            $addToSet: { upvotedBy: user },
          },
          { new: true },
        )
        .populate('createdBy upvotedBy')
        .exec();
    } catch (err) {
      this.logger.error('Error upvoting post', err);
      throw new InternalServerErrorException();
    }
  }

  async downvote(postPubId: string, user: User): Promise<Post> {
    try {
      return await this.postModel
        .findOneAndUpdate(
          { pubId: postPubId },
          {
            $pull: { upvotedBy: user._id },
          },
          { new: true },
        )
        .populate('createdBy upvotedBy')
        .exec();
    } catch (err) {
      this.logger.error('Error downvoting post', err);
      throw new InternalServerErrorException();
    }
  }
}
