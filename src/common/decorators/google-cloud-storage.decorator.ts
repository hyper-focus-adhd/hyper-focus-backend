import { Storage } from '@google-cloud/storage';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GoogleCloudStorage = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): Storage => {
    const request = ctx.switchToHttp().getRequest();
    return request.app.get(Storage);
  },
);
