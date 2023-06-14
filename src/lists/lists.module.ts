import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ListsService } from './lists.service';
import { ListsResolver } from './lists.resolver';
import { List } from './entities/list.entity';
import { ListItemsModule } from '../list-items/list-items.module';

@Module({
  providers: [ListsResolver, ListsService],
  imports: [
    TypeOrmModule.forFeature([List]),
    forwardRef(() => ListItemsModule),
  ],
  exports: [ListsService, TypeOrmModule],
})
export class ListsModule {}
