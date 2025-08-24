import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './create-customer.dto';
import { Customer } from './customer.entity';

@Controller('customer')
export class CustomerController {
  constructor(private readonly service: CustomerService) {}

  @Post()
  create(@Body() dto: CreateCustomerDto) {
    return this.service.create(dto);
  }

  @Get('searchByMobile')
  async suggestCustomers(@Query('mobile') mobile: string) {
    if (!mobile || mobile.trim() === '') {
      return {
        statusCode: 400,
        message: 'Please provide a mobile number for search',
        data: [],
      };  
    }

    return this.service.suggestByMobile(mobile);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() attrs: Partial<Customer>,
  ) {
    return this.service.update(id, attrs);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
