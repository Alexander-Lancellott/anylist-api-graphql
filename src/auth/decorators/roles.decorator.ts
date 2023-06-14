import { UseGuards, applyDecorators } from '@nestjs/common';
import { ValidRoles } from '../enums/valid-roles.enum';
import { RoleProctected } from './role-proctected.decorator';
import { UserRoleGuard } from '../guards/user-role.guard';

export const Roles = (...roles: ValidRoles[]) => {
  return applyDecorators(RoleProctected(...roles), UseGuards(UserRoleGuard));
};
