import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SKIP_RESPONSE_TRANSFORM } from '../decorators/skip-response-transformation.decorator';

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
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const skip = this.reflector.getAllAndOverride<boolean>(
      SKIP_RESPONSE_TRANSFORM,
      [context.getHandler(), context.getClass()],
    );
    if (skip) {
      return next.handle();
    }

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
