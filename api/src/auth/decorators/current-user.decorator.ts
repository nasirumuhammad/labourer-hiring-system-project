import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Payload } from '../types/payload.type';

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): Payload => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
