import { ArgsType, Field, Int, IntersectionType } from '@nestjs/graphql';
import { IsNumber, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { SearchArgs } from './search.args';

@ArgsType()
export class PaginationArgs {
  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  page = 1;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  limit = 10;
}

@ArgsType()
export class PaginationWithSearchArgs extends IntersectionType(
  PaginationArgs,
  SearchArgs,
) {}
