import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Item } from '../entities/item.entity';

@ObjectType()
export class ItemsPagination {
  @Field(() => Int)
  page: number;

  @Field(() => Int)
  totalPages: number;

  @Field(() => Int)
  totalItems: number;

  @Field(() => [Item])
  items: Item[];
}
