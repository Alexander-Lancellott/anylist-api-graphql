import { ParseUUIDPipe } from '@nestjs/common';
import {
  Resolver,
  Query,
  Mutation,
  Args,
  ID,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { UpdateUserInput } from './dto/update-user.input';
import { ValidRolesWithPaginationArgs } from './dto/args/roles.arg';
import { ValidRoles } from '../auth/enums/valid-roles.enum';
import { Auth } from '../auth/decorators/auth.decoretor';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ItemsService } from '../items/items.service';
import { ListsService } from '../lists/lists.service';
import { PaginationWithSearchArgs } from '../common/dto/args';
import { ItemsPagination } from '../items/types/items-pagination.type';
import { ListsPagination } from '../lists/types/lists-pagination.type';
import { UsersPagination } from './types/users-pagination.type';

@Resolver(() => User)
//@UseGuards(JwtAuthGuard, UserRoleGuard)
@Auth()
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly itemsService: ItemsService,
    private readonly listsService: ListsService,
  ) {}

  @Query(() => UsersPagination, { name: 'getUsers' })
  @Roles(ValidRoles.admin)
  findAll(
    @Args() validRolesWithPaginationArgs: ValidRolesWithPaginationArgs,
    //@CurrentUser([ValidRoles.admin]) user: User,
  ): Promise<UsersPagination> {
    return this.usersService.findAll(validRolesWithPaginationArgs);
  }

  @Query(() => User, { name: 'user' })
  @Roles(ValidRoles.admin, ValidRoles.superUser)
  findOne(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
  ): Promise<User> {
    return this.usersService.findOneById(id);
  }

  @Mutation(() => User, { name: 'updateUser' })
  @Roles(ValidRoles.admin)
  updateUser(
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
    @CurrentUser() user: User,
  ): Promise<User> {
    return this.usersService.update(updateUserInput.id, updateUserInput, user);
  }

  @Mutation(() => User, { name: 'blockUser' })
  @Roles(ValidRoles.admin)
  blockUser(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ): Promise<User> {
    return this.usersService.block(id, user);
  }

  @ResolveField(() => ItemsPagination, { name: 'getItems' })
  @Roles(ValidRoles.admin)
  getItemsByUser(
    @Parent() user: User,
    @Args() paginationWithSearchArgs: PaginationWithSearchArgs,
  ): Promise<ItemsPagination> {
    return this.itemsService.findAll(user, paginationWithSearchArgs);
  }

  @ResolveField(() => ListsPagination, { name: 'getLists' })
  @Roles(ValidRoles.admin)
  getListsByUser(
    @Parent() user: User,
    @Args() paginationWithSearchArgs: PaginationWithSearchArgs,
  ): Promise<ListsPagination> {
    return this.listsService.findAll(paginationWithSearchArgs, user);
  }
}
