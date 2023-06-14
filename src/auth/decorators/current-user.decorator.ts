import {
  ExecutionContext,
  InternalServerErrorException,
  createParamDecorator,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { User } from '../../users/entities/user.entity';

export const CurrentUser = createParamDecorator(
  (args: any, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);

    const user: User = ctx.getContext().req.user;

    if (!user)
      throw new InternalServerErrorException(
        'No user inside the request - make sure that we used the AuthGuard',
      );

    return user;
  },
);
