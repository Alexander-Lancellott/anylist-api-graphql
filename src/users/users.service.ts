import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import { SignupInput } from '../auth/dto/inputs';
import { InjectRepository } from '@nestjs/typeorm';
import { Helper } from '../common/helper/helper';
import { UsersPagination } from './types/users-pagination.type';
import { ValidRolesWithPaginationArgs } from './dto/args/roles.arg';

@Injectable()
export class UsersService {
  private helper = new Helper('UserService');
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(signupInput: SignupInput): Promise<User> {
    try {
      const newUser = this.usersRepository.create({
        ...signupInput,
        password: bcrypt.hashSync(signupInput.password, 10),
      });
      return await this.usersRepository.save(newUser);
    } catch (error) {
      this.helper.handleDBExceptions(error);
    }
  }

  async findAll(
    validRolesWithPaginationArgs: ValidRolesWithPaginationArgs,
  ): Promise<UsersPagination> {
    // eslint-disable-next-line prefer-const
    let { roles, page, limit, search } = validRolesWithPaginationArgs;
    page ||= 1;
    limit ||= 10;

    const queryBuilder = this.usersRepository
      .createQueryBuilder()
      .take(limit)
      .skip((page - 1) * limit);

    if (search) {
      queryBuilder.andWhere(`LOWER("fullName") like :fullName`, {
        fullName: `%${search.toLowerCase()}%`,
      });
    }

    let usersPromise: Promise<User[]>;

    if (roles.length === 0) {
      usersPromise = queryBuilder.getMany();
    } else {
      usersPromise = queryBuilder
        .andWhere('ARRAY[roles] @> ARRAY[:...roles]')
        .setParameter('roles', roles)
        .getMany();
    }

    const [users, totalUsers] = await Promise.all([
      usersPromise,
      queryBuilder.getCount(),
    ]);

    const totalPages = Math.ceil(totalUsers / limit);

    return { users, page, totalPages, totalUsers };

    //! No es necesario ya que tenemos lazy en la entidad de user
    // return this.usersRepository.find({
    // relations: {
    //   lastUpdateBy: true,
    // },
  }

  async getUser(email: string, password: string): Promise<User> {
    const user = await this.usersRepository.findOneBy({ email });
    if (!user || !bcrypt.compareSync(password, user.password))
      throw new BadRequestException('email or password is invalid ');
    return user;
  }

  async findOneById(id: string, validateException = true): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });

    if (validateException && !user)
      throw new NotFoundException(`User with id: ${id} not found`);

    return user;
  }

  async update(
    id: string,
    updateUserInput: UpdateUserInput,
    user: User,
  ): Promise<User> {
    await this.findOneById(id);
    const userPreload = await this.usersRepository.preload(updateUserInput);
    userPreload.lastUpdateBy = user;
    return this.usersRepository.save(userPreload);
  }

  async block(id: string, currentUser: User): Promise<User> {
    const userToBlock = await this.findOneById(id);
    userToBlock.lastUpdateBy = currentUser;
    userToBlock.isActive = false;

    return this.usersRepository.save(userToBlock);
  }
}
