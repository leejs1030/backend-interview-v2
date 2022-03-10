import { Controller, Get } from '@nestjs/common';
import { product } from 'custom-type';
import { ProductService } from './products.service';
import db from 'src/lib/dbconnection';

@Controller('products')
export class ProductController{
  constructor(private readonly ProductService: ProductService) {}

  @Get()
  async getProducts(): Promise<product[]>{
    return this.ProductService.getProducts(db);
  }
}