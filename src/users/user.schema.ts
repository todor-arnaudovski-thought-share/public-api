import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude, Expose } from 'class-transformer';
import { HydratedDocument, Types } from 'mongoose';
// import { v4 as uuidv4 } from 'uuid';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  // @Prop({ default: () => uuidv4(), unique: true })
  // @Expose()
  // publicId: string;

  @Prop({ required: true, unique: true })
  @Expose()
  username: string;

  @Prop({ required: true })
  @Exclude()
  password: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Post' }] })
  @Expose()
  upvotedPosts: Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);
