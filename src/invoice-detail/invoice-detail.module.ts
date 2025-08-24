import { Module } from '@nestjs/common';
import { InvoiceDetailController } from './invoice-detail.controller';
import { InvoiceDetailService } from './invoice-detail.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvoiceDetail } from './invoice-detail.entity';
import { Invoice } from 'src/invoice/invoice.entity';
import { Item } from 'src/item/item.entity';

@Module({
  imports:[TypeOrmModule.forFeature([InvoiceDetail])],
  controllers: [InvoiceDetailController],
  providers: [InvoiceDetailService]
})
export class InvoiceDetailModule {}
