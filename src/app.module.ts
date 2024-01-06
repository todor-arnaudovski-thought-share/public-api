import { Module } from '@nestjs/common';
import { MongoDbDatabaseProviderModule } from './providers/database/mongodb/provider.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './models/users/users.module';
import { PostsModule } from './models/posts/posts.module';
import { ConfigModule } from '@nestjs/config';
import { configValidationSchema } from './config';
import { EmailModule } from './email/email.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.STAGE ?? 'development'}`,
      validationSchema: configValidationSchema,
      validationOptions: {
        abortEarly: true,
      },
    }),
    MongoDbDatabaseProviderModule,
    PostsModule,
    AuthModule,
    UsersModule,
    EmailModule,
  ],
})
export class AppModule {}
