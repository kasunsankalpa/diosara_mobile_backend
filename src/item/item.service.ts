import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Item } from './item.entity';
import { CreateItemDto } from './create-item.dto';

@Injectable()
export class ItemService {
    constructor(
            @InjectRepository(Item)
            private repo: Repository<Item>,
          ) {}

    create (dto:CreateItemDto){

    }

async findByItemCode(itemCode: string): Promise<Item> {
    return await this.repo.findOne({
      where: { itemCode },
      select: [
        'id',
        'itemCode',
        'itemName',
        'sellingPrice',
        'discount',
      ],
    });
}
}
