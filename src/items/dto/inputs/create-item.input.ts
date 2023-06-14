import {
  InputType,
  Field,
  // Float
} from '@nestjs/graphql';

import {
  IsString,
  // IsNumber,
  IsNotEmpty,
  IsOptional,
  // IsPositive,
} from 'class-validator';

@InputType()
export class CreateItemInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  name: string;

  // @Field(() => Float)
  // @IsNumber()
  // @IsPositive()
  // quantity: number;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  quantityUnits?: string;
}
