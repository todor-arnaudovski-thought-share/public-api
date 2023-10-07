import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
// import { plainToInstance } from 'class-transformer';
// import { User } from './user.schema';

@Injectable()
export class AuthInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        // return plainToInstance(User, data, {
        //   excludeExtraneousValues: true,
        // });
        return data;
      }),
    );
  }
}
