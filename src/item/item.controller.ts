import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { ItemService } from './item.service';

@Controller('item')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Get('code/:itemCode')
  async findByItemCode(@Param('itemCode') itemCode: string) {

    const item = await this.itemService.findByItemCode(itemCode);
    if(!item){
        throw new NotFoundException(`Item with code "${itemCode}" not found`);
    }
    return {
        itemId:item.id,
        itemCode:item.itemCode,
        itemName:item.itemName,
        sellingPrice:item.sellingPrice,
        discountPercentage:item.discount * 100 + "%",
        discount:item.discount * item.sellingPrice,
        discountedPrice:item.sellingPrice - (item.sellingPrice * item.discount)
    };
  }
}
