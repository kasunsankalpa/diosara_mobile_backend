import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from './customer.entity';
import { Like, Repository } from 'typeorm';
import { CreateCustomerDto } from './create-customer.dto';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private repo: Repository<Customer>,
  ) {}

  create(dto: CreateCustomerDto) {
    const customer = this.repo.create(dto);
    return this.repo.save(customer);
  }

  async suggestByMobile(mobileNum: string) {
    const customers = await this.repo.find({
      where: { mobileNum: Like(`%${mobileNum}%`) },
    });

    if (!customers.length) {
      return {
        statusCode: 404,
        message: `No customers found matching "${mobileNum}"`,
        data: [],
      };
    }

    return {
      statusCode: 200,
      message: 'Customers retrieved successfully',
      data: customers,
    };
  }

  findAll() {
    return this.repo.find();
  }

  findOne(id: number) {
    return this.repo.findOneBy({ id });
  }

  async update(id: number, attrs: Partial<Customer>) {
    await this.repo.update(id, attrs);
    return this.findOne(id);
  }

  remove(id: number) {
    return this.repo.delete(id);
  }
}
