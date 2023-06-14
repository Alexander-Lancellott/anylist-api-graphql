import { Field, Int, ObjectType } from '@nestjs/graphql';
import { List } from '../entities/list.entity';

@ObjectType()
export class ListsPagination {
  @Field(() => Int)
  page: number;

  @Field(() => Int)
  totalPages: number;

  @Field(() => Int)
  totalLists: number;

  @Field(() => [List])
  lists: List[];
}
