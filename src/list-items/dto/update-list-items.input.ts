import { IsUUID } from 'class-validator';
import { CreateListItemInput } from './create-list-items.input';
import { InputType, Field, PartialType, ID } from '@nestjs/graphql';

@InputType()
export class UpdateListItemInput extends PartialType(CreateListItemInput) {
  @Field(() => ID)
  @IsUUID()
  id: string;
}
