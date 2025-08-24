export class CreateInvoiceDto {
    customer: {
      id:number;
       name: string;
       mobileNum: string;
      instituteId: number;
    };
    total: number;
    totalDiscount: number;
    status:number;
    item:[{id:number , qty:number}];
    userId:number;
  }