import { Module } from '@nestjs/common';
import { InvoiceController } from './invoice.controller';
import { InvoiceService } from './invoice.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invoice } from './invoice.entity';
import { InvoiceDetail } from 'src/invoice-detail/invoice-detail.entity';
import { Customer } from 'src/customer/customer.entity';
import { Item } from 'src/item/item.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Invoice, InvoiceDetail,
    Customer,
    Item]),
    
],
  controllers: [InvoiceController],
  providers: [InvoiceService]
})
export class InvoiceModule {}
