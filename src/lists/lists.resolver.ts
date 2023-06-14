import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { ListsService } from './lists.service';
import { List } from './entities/list.entity';
import { CreateListInput } from './dto/create-list.input';
import { UpdateListInput } from './dto/update-list.input';
import { Auth } from '../auth/decorators/auth.decoretor';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { PaginationWithSearchArgs } from '../common/dto/args';
import { ListsPagination } from './types/lists-pagination.type';
import { ParseUUIDPipe } from '@nestjs/common';
import { ListItemsService } from '../list-items/list-items.service';
import { ListItemsPagination } from '../list-items/types/list-items-pagination.type';

@Resolver(() => List)
@Auth()
export class ListsResolver {
  constructor(
    private readonly listsService: ListsService,
    private readonly listItemsService: ListItemsService,
  ) {}

  @Mutation(() => List, { name: 'createList' })
  createList(
    @CurrentUser() user: User,
    @Args('createListInput') createListInput: CreateListInput,
  ): Promise<List> {
    return this.listsService.create(createListInput, user);
  }

  @Query(() => ListsPagination, { name: 'getLists' })
  findAll(
    @CurrentUser() user: User,
    @Args() paginationWithSearchArgs: PaginationWithSearchArgs,
  ): Promise<ListsPagination> {
    return this.listsService.findAll(paginationWithSearchArgs, user);
  }

  @Query(() => List, { name: 'list' })
  findOne(
    @CurrentUser() user: User,
    @Args('id', { type: () => String }, ParseUUIDPipe) id: string,
  ): Promise<List> {
    return this.listsService.findOne(id, user);
  }

  @Mutation(() => List, { name: 'updateList' })
  updateList(
    @CurrentUser() user: User,
    @Args('updateListInput') updateListInput: UpdateListInput,
  ): Promise<List> {
    return this.listsService.update(updateListInput.id, updateListInput, user);
  }

  @Mutation(() => List, { name: 'removeList' })
  removeList(
    @CurrentUser() user: User,
    @Args('id', { type: () => String }, ParseUUIDPipe) id: string,
  ): Promise<List> {
    return this.listsService.remove(id, user);
  }

  @ResolveField(() => ListItemsPagination, { name: 'getListItems' })
  getListItems(
    @Parent() list: List,
    @Args() paginationWithSearchArgs: PaginationWithSearchArgs,
  ): Promise<ListItemsPagination> {
    return this.listItemsService.findAll(list, paginationWithSearchArgs);
  }
}
