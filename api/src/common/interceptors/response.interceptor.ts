import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ApiResponse<T> {
  message?: string;
  data?: T;
}

function isMessageOnlyResult(result: unknown): result is { message: string } {
  return (
    typeof result === 'object' &&
    result !== null &&
    'message' in result &&
    !('data' in result)
  );
}

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<unknown>> {
    return next.handle().pipe(
      map((result: unknown) => {
        if (typeof result === 'string') {
          return { message: result };
        }
        if (isMessageOnlyResult(result)) {
          return result;
        }
        return { data: result };
      }),
    );
  }
}
