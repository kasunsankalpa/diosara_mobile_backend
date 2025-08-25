import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerModule } from './customer/customer.module';
import { ItemModule } from './item/item.module';
import { InvoiceModule } from './invoice/invoice.module';
import { InvoiceDetailModule } from './invoice-detail/invoice-detail.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      //  isGlobal: true,
      type: 'mysql',
      // host: process.env.DATABASE_HOST,
      host: 'localhost',
      // port:parseInt(process.env.DATABASE_PORT,10) ,
      port: 3306,
      username: 'vbubjunp_vbuuser',
      password: '5m0@W232lIQG',
      database: 'vbubjunp_diosara',
      autoLoadEntities: true,
      synchronize: true, // disable in production
    }),
    CustomerModule,
    ItemModule,
    InvoiceModule,
    InvoiceDetailModule,
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {

}
