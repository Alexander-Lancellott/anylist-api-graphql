import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ListItem } from '../entities/list-item.entity';

@ObjectType()
export class ListItemsPagination {
  @Field(() => Int)
  page: number;

  @Field(() => Int)
  totalPages: number;

  @Field(() => Int)
  totalListItems: number;

  @Field(() => [ListItem])
  listItems: ListItem[];
}
