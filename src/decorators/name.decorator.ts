import {
  createParamDecorator,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common';
import { Request } from 'express';

export const Name = createParamDecorator(
  (_data: any, context: ExecutionContext): string => {
    const http = context.switchToHttp();
    const request = http.getRequest<Request>();
    const { name } = request.body;
    if (name === 'Not Dan') {
      throw new NotFoundException(
        `The name ${name} could not be found. Are you sure this person is real?`,
      );
    }
    return name;
  },
);
