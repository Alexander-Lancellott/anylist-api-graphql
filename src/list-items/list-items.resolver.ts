import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ListItemsService } from './list-items.service';
import { ListItem } from './entities/list-item.entity';
import { CreateListItemInput } from './dto/create-list-items.input';
import { UpdateListItemInput } from './dto/update-list-items.input';
import { Auth } from '../auth/decorators/auth.decoretor';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { ParseUUIDPipe } from '@nestjs/common';

@Resolver(() => ListItem)
@Auth()
export class ListItemsResolver {
  constructor(private readonly listItemsService: ListItemsService) {}

  @Mutation(() => ListItem)
  createListItem(
    @CurrentUser() user: User,
    @Args('createListItemInput') createListItemInput: CreateListItemInput,
  ) {
    return this.listItemsService.create(createListItemInput, user);
  }

  @Query(() => ListItem, { name: 'listItem' })
  findOne(
    @CurrentUser() user: User,
    @Args('id', { type: () => String }, ParseUUIDPipe) id: string,
  ) {
    return this.listItemsService.findOne(id, user);
  }

  @Mutation(() => ListItem)
  updateListItem(
    @CurrentUser() user: User,
    @Args('updateListItemInput') updateListItemInput: UpdateListItemInput,
  ): Promise<ListItem> {
    return this.listItemsService.update(
      updateListItemInput.id,
      updateListItemInput,
      user,
    );
  }
}
