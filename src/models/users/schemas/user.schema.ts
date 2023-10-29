import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types, Document } from 'mongoose';
import { nanoid } from 'nanoid';
import { Post } from '../../posts/schemas/post.schema';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ default: () => nanoid(), unique: true })
  pubId: string;

  // email: string;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Post' }] })
  upvotedPosts: Types.ObjectId[] | Post[];

  @Prop()
  hashedRt: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
