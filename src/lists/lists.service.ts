import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateListInput } from './dto/create-list.input';
import { UpdateListInput } from './dto/update-list.input';
import { InjectRepository } from '@nestjs/typeorm';
import { List } from './entities/list.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { PaginationWithSearchArgs } from '../common/dto/args/pagination.args';
import { ListsPagination } from './types/lists-pagination.type';

@Injectable()
export class ListsService {
  constructor(
    @InjectRepository(List)
    private readonly listsRepository: Repository<List>,
  ) {}

  async create(createListInput: CreateListInput, user: User): Promise<List> {
    const list = await this.listsRepository.create({
      ...createListInput,
      user,
    });
    return this.listsRepository.save(list);
  }

  async findAll(
    paginationWithSearchArgs: PaginationWithSearchArgs,
    user: User,
  ): Promise<ListsPagination> {
    // eslint-disable-next-line prefer-const
    let { page, limit, search } = paginationWithSearchArgs;
    page ||= 1;
    limit ||= 10;

    const queryBuilder = this.listsRepository
      .createQueryBuilder()
      .take(limit)
      .skip((page - 1) * limit)
      .where(`"userId" = :userId`, { userId: user.id });

    if (search) {
      queryBuilder.andWhere('LOWER(name) like :name', {
        name: `%${search.toLowerCase()}%`,
      });
    }

    const [lists, totalLists] = await Promise.all([
      queryBuilder.getMany(),
      queryBuilder.getCount(),
    ]);

    const totalPages = Math.ceil(totalLists / limit);

    return { lists, page, totalPages, totalLists };
  }

  async findOne(id: string, user: User): Promise<List> {
    const list = await this.listsRepository.findOneBy({
      id,
      user: { id: user.id },
    });

    if (!list) throw new NotFoundException(`List with id: ${id} not found`);

    return list;
  }

  async update(
    id: string,
    updateListInput: UpdateListInput,
    user: User,
  ): Promise<List> {
    await this.findOne(id, user);
    const listPreload = await this.listsRepository.preload(updateListInput);
    return this.listsRepository.save(listPreload);
  }

  async remove(id: string, user): Promise<List> {
    const list = await this.findOne(id, user);
    await this.listsRepository.remove(list);
    return { ...list, id, user };
  }
}
