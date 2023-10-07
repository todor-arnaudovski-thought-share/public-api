import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Expose } from 'class-transformer';
import { HydratedDocument, Types } from 'mongoose';

export type PostDocument = HydratedDocument<Post>;

@Schema({ timestamps: true })
export class Post {
  @Prop({ required: true })
  @Expose()
  content: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  @Expose()
  createdBy: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
  @Expose()
  upvotedBy: Types.ObjectId[];
}

export const PostSchema = SchemaFactory.createForClass(Post);
