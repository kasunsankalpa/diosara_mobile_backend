import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Item } from 'src/item/item.entity';
import { InvoiceDetail } from 'src/invoice-detail/invoice-detail.entity';
import { Customer } from 'src/customer/customer.entity';
import { Invoice } from './invoice.entity';
import { CreateInvoiceDto } from './create-invoice.dto';
import * as dayjs from 'dayjs';

@Injectable()
export class InvoiceService {
    constructor(
        @InjectRepository(Invoice)
        private invoiceRepo: Repository<Invoice>,
        @InjectRepository(InvoiceDetail)
        private detailRepo: Repository<InvoiceDetail>,
        @InjectRepository(Customer)
        private customerRepo: Repository<Customer>,
        @InjectRepository(Item)
        private itemRepo: Repository<Item>,
        private dataSource: DataSource,
     ){
        
    }



async create(dto: CreateInvoiceDto) {
  return await this.dataSource.transaction(async manager => {
    let customer;

    // Find or create customer
    if (dto.customer?.id) {
      customer = await manager.findOne(Customer, { where: { id: dto.customer.id } });
      if (!customer) throw new Error('Customer not found');
    } else {
      customer = manager.create(Customer, {
        name: dto.customer.name,
        mobileNum: dto.customer.mobileNum,
        instituteId: dto.customer.instituteId,
        status: 1,
      });
      customer = await manager.save(customer);
    }

    // Extract item IDs & fetch items
    const itemIds = dto.item.map(i => i.id);
    const items = await manager.findByIds(Item, itemIds);

    if (items.length !== itemIds.length) {
      const foundIds = items.map(i => i.id);
      const missing = itemIds.filter(id => !foundIds.includes(id));
      throw new Error(`Items not found: ${missing.join(', ')}`);
    }

    // Attach qty
    const itemsWithQty = items.map(item => {
      const dtoItem = dto.item.find(i => i.id === item.id);
      return {
        ...item,
        qty: dtoItem?.qty ?? 1,
      };
    });

    // Totals
    let totalDiscount = 0;
    let total = 0;

    itemsWithQty.forEach(item => {
      const sellingPrice = Number(item.sellingPrice);
      const discount = Number(item.discount);
      const qty = Number(item.qty);

      const itemTotal = sellingPrice * qty;
      const itemDiscount = discount * sellingPrice * qty;
      total += itemTotal;
      totalDiscount += itemDiscount;
    });

    // Save invoice
    const invoice = manager.create(Invoice, {
     
      customer,
      total: Number(total.toFixed(2)),
      status: dto.status,
      totalDiscount: Number(totalDiscount.toFixed(2)),
      billAmount: Number((total - totalDiscount).toFixed(2)),
    });
    const savedInvoice = await manager.save(invoice);

    // Save invoice details
    const details = itemsWithQty.map(item =>
      manager.create(InvoiceDetail, {
        invoice: savedInvoice,
        item,
        itemPrice: Number(Number(item.sellingPrice).toFixed(2)),
        discountPercentage: Number(item.discount),
        discount: Number((Number(item.discount) * Number(item.sellingPrice) * item.qty).toFixed(2)),
        status: 1,
        discountedPrice: Number(((Number(item.sellingPrice) * item.qty) - (Number(item.discount) * Number(item.sellingPrice) * item.qty)).toFixed(2)),
        qty: item.qty,
        discountedPercentage: Number(item.discount)
      }),
    );

    const savedDetails = await manager.save(details);

    // Date formatting helper
    const formatDate = (date: Date) => dayjs(date).format('YYYY-MM-DD HH:mm:ss');

    // Return invoice + cleaned item details + formatted dates
    return {
      id: savedInvoice.id,
      total: Number(Number(savedInvoice.total).toFixed(2)),
      totalDiscount: Number(Number(savedInvoice.totalDiscount).toFixed(2)),
      billAmount: Number(Number(savedInvoice.billAmount).toFixed(2)),
      status: savedInvoice.status,
      createdAt: formatDate(savedInvoice.createdAt),
      customer: {
        ...customer,
        createdAt: formatDate(customer.createdAt),
      },
      items: savedDetails.map(d => ({
        id: d.item.id,
        name: d.item.itemName,
        qty: d.qty,
        itemPrice: Number(Number(d.itemPrice).toFixed(2)),
        discountPercentage: `${(Number(d.discountedPercentage) * 100).toFixed(2)}%`,
        discountAmount: Number(Number(d.discount).toFixed(2)),
        discountedPrice: Number(Number(d.discountedPrice).toFixed(2)),
      })),
    };
  });
}


async getLast20Transactions() {
  const invoices = await this.dataSource.getRepository(Invoice).find({
    relations: {
      customer: true,
      invoiceDetails: { item: true },
    },
    order: { createdAt: 'DESC' },
    take: 20,
  });

  const formatDate = (date: Date) => dayjs(date).format('YYYY-MM-DD HH:mm:ss');

  return invoices.map(invoice => ({
    id: invoice.id,
    total: invoice.total,
    totalDiscount: invoice.totalDiscount,
    billAmount: invoice.billAmount,
    status: invoice.status,
    createdAt: formatDate(invoice.createdAt),
    customer: invoice.customer
      ? {
          ...invoice.customer,
          createdAt: formatDate(invoice.customer.createdAt),
        }
      : null,
    items: (invoice.invoiceDetails ?? []).map(detail => ({
      id: detail.item?.id ?? null,
      name: detail.item?.itemName ?? '',
      qty: detail.qty,
      itemPrice: detail.itemPrice,
      discountPercentage: `${(detail.discountedPercentage * 100).toFixed(2)}%`,
      discountAmount: detail.discount,
      discountedPrice: detail.discountedPrice,
    })),
  }));
}





}
