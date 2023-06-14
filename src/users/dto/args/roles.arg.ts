import { IsArray } from 'class-validator';
import { ValidRoles } from '../../../auth/enums/valid-roles.enum';
import { ArgsType, Field, IntersectionType } from '@nestjs/graphql';
import { PaginationWithSearchArgs } from '../../../common/dto/args';

@ArgsType()
export class ValidRolesArgs {
  @Field(() => [ValidRoles], { nullable: true })
  @IsArray()
  roles: ValidRoles[] = [];
}

@ArgsType()
export class ValidRolesWithPaginationArgs extends IntersectionType(
  ValidRolesArgs,
  PaginationWithSearchArgs,
) {}
