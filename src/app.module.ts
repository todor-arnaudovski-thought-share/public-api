import { Module } from '@nestjs/common';
import { MongoDbDatabaseProviderModule } from './providers/database/mongodb/provider.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './models/users/users.module';
import { PostsModule } from './models/posts/posts.module';

@Module({
  imports: [
    MongoDbDatabaseProviderModule,
    PostsModule,
    AuthModule,
    UsersModule,
  ],
})
export class AppModule {}
