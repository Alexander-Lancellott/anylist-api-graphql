import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateItemInput, UpdateItemInput } from './dto/inputs';
import { Item } from './entities/item.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { PaginationWithSearchArgs } from '../common/dto/args';
import { ItemsPagination } from './types/items-pagination.type';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private readonly itemsRepository: Repository<Item>,
  ) {}

  async create(createItemInput: CreateItemInput, user: User): Promise<Item> {
    const newItem = this.itemsRepository.create({ ...createItemInput, user });
    return await this.itemsRepository.save(newItem);
  }

  async findAll(
    user: User,
    paginationWithSearchArgs: PaginationWithSearchArgs,
  ): Promise<ItemsPagination> {
    // eslint-disable-next-line prefer-const
    let { page, limit, search } = paginationWithSearchArgs;
    page ||= 1;
    limit ||= 10;

    const queryBuilder = this.itemsRepository
      .createQueryBuilder()
      .take(limit)
      .skip((page - 1) * limit)
      .where(`"userId" = :userId`, { userId: user.id });

    if (search) {
      queryBuilder.andWhere('LOWER(name) like :name', {
        name: `%${search.toLowerCase()}%`,
      });
    }

    const [items, totalItems] = await Promise.all([
      queryBuilder.getMany(),
      queryBuilder.getCount(),
    ]);

    const totalPages = Math.ceil(totalItems / limit);

    return { items, page, totalPages, totalItems };
    // return await this.itemsRepository.find({
    //   take: limit,
    //   skip: offset,
    //   where: { user: { id: user.id }, name: Like(`%${search}%`) },
    // });
  }

  async findOne(id: string, user: User): Promise<Item> {
    const item = await this.itemsRepository.findOneBy({
      id,
      user: { id: user.id },
    });

    if (!item) throw new NotFoundException(`Item with id: ${id} not found`);

    return item;
  }

  async update(
    id: string,
    updateItemInput: UpdateItemInput,
    user: User,
  ): Promise<Item> {
    await this.findOne(id, user);
    const itemPreload = await this.itemsRepository.preload(updateItemInput);
    return await this.itemsRepository.save(itemPreload);
  }

  async remove(id: string, user: User) {
    const item = await this.findOne(id, user);
    await this.itemsRepository.remove(item);
    return { ...item, id, user };
  }
}
