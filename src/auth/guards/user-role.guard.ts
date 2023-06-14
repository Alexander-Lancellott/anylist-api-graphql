import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { User } from '../../users/entities/user.entity';
import { GqlExecutionContext } from '@nestjs/graphql';
import { META_ROLES } from '../decorators/role-proctected.decorator';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const validRoles: string[] = this.reflector.getAllAndOverride(META_ROLES, [
      context.getHandler(),
      context.getClass(),
    ]);
    const ctx = GqlExecutionContext.create(context);
    const req = ctx.getContext().req;
    const user: User = req.user;

    if (!user)
      throw new InternalServerErrorException('User not found (request)');

    if (validRoles && validRoles.length !== 0) {
      for (const role of user.roles) {
        if (validRoles.includes(role)) {
          return true;
        }
      }

      throw new ForbiddenException(
        `User ${user.fullName} need a valid roles: [ ${validRoles
          .toString()
          .replace(',', ', ')} ]`,
      );
    } else {
      return true;
    }
  }
}
