import { Body, Controller, Get, Post, UseGuards ,Request} from '@nestjs/common';
import { CreateInvoiceDto } from './create-invoice.dto';
import { InvoiceService } from './invoice.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('invoice')
export class InvoiceController {
      constructor(private readonly invoiceService: InvoiceService) {}
    
    @Post()
     @UseGuards(JwtAuthGuard)
  async create(@Body() createInvoiceDto: CreateInvoiceDto,@Request() req) {
    createInvoiceDto.userId=req.user.userId;
    return await this.invoiceService.create(createInvoiceDto);
  }

  @Get('last-20')
  @UseGuards(JwtAuthGuard)
  async getLast20Transactions(@Request() req) {
    console.log(req.user);
    return await this.invoiceService.getLast20Transactions();
  }
}
