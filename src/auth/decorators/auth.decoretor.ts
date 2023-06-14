import { applyDecorators, UseGuards } from '@nestjs/common';
import { ValidRoles } from '../enums/valid-roles.enum';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { Roles } from './roles.decorator';

export const Auth = (...roles: ValidRoles[]) => {
  return applyDecorators(UseGuards(JwtAuthGuard), Roles(...roles));
};
