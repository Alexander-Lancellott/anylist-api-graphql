import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateListItemInput } from './dto/create-list-items.input';
import { UpdateListItemInput } from './dto/update-list-items.input';
import { InjectRepository } from '@nestjs/typeorm';
import { ListItem } from './entities/list-item.entity';
import { Repository } from 'typeorm';
import { ListsService } from '../lists/lists.service';
import { ItemsService } from '../items/items.service';
import { User } from '../users/entities/user.entity';
import { List } from '../lists/entities/list.entity';
import { Item } from '../items/entities/item.entity';
import { PaginationWithSearchArgs } from '../common/dto/args';
import { ListItemsPagination } from './types/list-items-pagination.type';

@Injectable()
export class ListItemsService {
  constructor(
    @InjectRepository(ListItem)
    private readonly listItemsRepository: Repository<ListItem>,
    private readonly itemsService: ItemsService,
    private readonly listsService: ListsService,
  ) {}

  async create(
    createListItemInput: CreateListItemInput,
    user: User,
  ): Promise<ListItem> {
    const { listId, itemId, ...rest } = createListItemInput;
    const getItemAndList: Promise<Item | List>[] = [
      this.itemsService.findOne(itemId, user),
      this.listsService.findOne(listId, user),
    ];
    const [item, list] = await Promise.all(getItemAndList);
    const newListItem = this.listItemsRepository.create({
      ...rest,
      item,
      list,
    });
    return this.listItemsRepository.save(newListItem);
  }

  async findAll(
    list: List,
    paginationWithSearchArgs: PaginationWithSearchArgs,
  ): Promise<ListItemsPagination> {
    // eslint-disable-next-line prefer-const
    let { page, limit, search } = paginationWithSearchArgs;
    page ||= 1;
    limit ||= 10;

    const queryBuilder = this.listItemsRepository
      .createQueryBuilder('listItem')
      .innerJoin('listItem.item', 'item')
      .take(limit)
      .skip((page - 1) * limit)
      .where(`"listId" = :listId`, { listId: list.id });

    if (search) {
      queryBuilder.andWhere('LOWER(item.name) like :name', {
        name: `%${search.toLowerCase()}%`,
      });
    }

    const [listItems, totalListItems] = await Promise.all([
      queryBuilder.getMany(),
      queryBuilder.getCount(),
    ]);

    const totalPages = Math.ceil(totalListItems / limit);

    return { listItems, page, totalPages, totalListItems };
  }

  async findOne(id: string, user: User): Promise<ListItem> {
    const listItem = await this.listItemsRepository.findOneBy({
      id,
      list: { user: { id: user.id } },
    });
    if (!listItem)
      throw new NotFoundException(`ListItem with id: ${id} not found`);

    return listItem;
  }

  async update(
    id: string,
    updateListItemInput: UpdateListItemInput,
    user: User,
  ): Promise<ListItem> {
    const { itemId, listId, ...rest } = updateListItemInput;

    const [item, list] = await Promise.all([
      itemId ? this.itemsService.findOne(itemId, user) : undefined,
      listId ? this.listsService.findOne(listId, user) : undefined,
      this.findOne(id, user),
    ]);

    const queryBuilder = this.listItemsRepository
      .createQueryBuilder()
      .where('id = :id', { id: id });

    await queryBuilder
      .update()
      .set({ ...rest, list, item })
      .execute();

    return queryBuilder.getOne();
  }

  remove(id: number) {
    return `This action removes a #${id} listItem`;
  }
}
