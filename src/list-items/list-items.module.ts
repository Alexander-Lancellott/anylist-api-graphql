import { Module, forwardRef } from '@nestjs/common';
import { ListItemsService } from './list-items.service';
import { ListItemsResolver } from './list-items.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListItem } from './entities/list-item.entity';
import { ItemsModule } from '../items/items.module';
import { ListsModule } from '../lists/lists.module';

@Module({
  providers: [ListItemsResolver, ListItemsService],
  imports: [
    TypeOrmModule.forFeature([ListItem]),
    ItemsModule,
    forwardRef(() => ListsModule),
  ],
  exports: [ListItemsService, TypeOrmModule],
})
export class ListItemsModule {}
