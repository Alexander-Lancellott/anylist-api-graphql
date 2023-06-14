import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from '../items/entities/item.entity';
import { Repository } from 'typeorm';
import { SEED_ITEMS, SEED_USERS, SEED_LISTS } from './data/seed-data';
import { User } from '../users/entities/user.entity';
import { List } from '../lists/entities/list.entity';
import { ListItem } from '../list-items/entities/list-item.entity';
import { UsersService } from '../users/users.service';
import { ItemsService } from '../items/items.service';
import { ListsService } from '../lists/lists.service';
import { ListItemsService } from '../list-items/list-items.service';
import { State } from '../common/types/enums';

@Injectable()
export class SeedService {
  private isProd: boolean;

  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly itemsService: ItemsService,
    private readonly listsService: ListsService,
    private readonly listItemsService: ListItemsService,

    @InjectRepository(Item)
    private readonly itemsRepository: Repository<Item>,

    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    @InjectRepository(ListItem)
    private readonly listItemsRepository: Repository<ListItem>,

    @InjectRepository(List)
    private readonly listsRepository: Repository<List>,
  ) {
    this.isProd = configService.getOrThrow('STATE') === State.Prod;
  }

  async executeSeed() {
    if (this.isProd) {
      throw new UnauthorizedException('We cannot run SEED on Prod');
    }

    await this.deleteDatabase();

    const user = await this.loadUsers();

    const items = await this.loadItems(user);

    const list = await this.loadLists(user);

    await this.loadListsItems(list, items, user);

    return true;
  }

  async deleteDatabase() {
    await this.listItemsRepository
      .createQueryBuilder()
      .delete()
      .where({})
      .execute();

    await this.listsRepository
      .createQueryBuilder()
      .delete()
      .where({})
      .execute();

    await this.itemsRepository
      .createQueryBuilder()
      .delete()
      .where({})
      .execute();

    await this.usersRepository
      .createQueryBuilder()
      .delete()
      .where({})
      .execute();
  }

  async loadUsers(): Promise<User> {
    const users = [];

    for (const user of SEED_USERS) {
      users.push(await this.usersService.create(user));
    }

    return users[0];
  }

  async loadItems(user: User): Promise<Item[]> {
    const itemsPromises = [];
    for (const item of SEED_ITEMS) {
      itemsPromises.push(this.itemsService.create(item, user));
    }
    const items = await Promise.all(itemsPromises);
    return items.slice(0, 15);
  }

  async loadLists(user: User): Promise<List> {
    const listsPromises = [];
    for (const list of SEED_LISTS) {
      listsPromises.push(this.listsService.create(list, user));
    }
    const lists = await Promise.all(listsPromises);
    return lists[0];
  }

  async loadListsItems(list: List, items: Item[], user: User): Promise<void> {
    const listItemsPromises = [];
    for (const item of items) {
      listItemsPromises.push(
        this.listItemsService.create(
          {
            quantity: Math.round(Math.random() * 10),
            completed: Math.random() < 0.5,
            listId: list.id,
            itemId: item.id,
          },
          user,
        ),
      );
    }
    await Promise.all(listItemsPromises);
  }
}
