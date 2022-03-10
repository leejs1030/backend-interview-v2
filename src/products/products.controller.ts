import { Controller, Get, Query } from '@nestjs/common';
import { product } from 'custom-type';
import { ProductService } from './products.service';
import db from 'src/lib/dbconnection';

@Controller('products')
export class ProductController{
  constructor(private readonly ProductService: ProductService) {}

  @Get()
  async getProducts(@Query('brand') brand: string | string[],
  @Query('minPrice') minPrice: string,
  @Query('maxPrice') maxPrice: string,
  @Query('order') order: string,
  @Query('direction') direction: string): Promise<product[]>{
    
    return this.ProductService.getProducts();
  }
}