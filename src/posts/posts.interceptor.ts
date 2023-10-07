import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
// import { plainToInstance } from 'class-transformer';
// import { Post } from './post.schema';

@Injectable()
export class PostsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        // return plainToInstance(Post, data, {
        //   excludeExtraneousValues: true,
        // });
        return data;
      }),
    );
  }
}
