import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types, Document } from 'mongoose';
import { nanoid } from 'nanoid';
import { User } from '../../users/schemas/user.schema';

export type PostDocument = HydratedDocument<Post>;

@Schema({ timestamps: true })
export class Post extends Document {
  createdAt: Date;

  @Prop({ default: () => nanoid(), unique: true })
  pubId: string;

  @Prop({ required: true })
  content: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId | User;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
  upvotedBy: Types.ObjectId[] | User[];
}

export const PostSchema = SchemaFactory.createForClass(Post);
