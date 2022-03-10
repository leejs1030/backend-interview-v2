import { Controller, Get } from '@nestjs/common';
import { product } from 'custom-type';
import { ProductService } from './products.service';

@Controller('products')
export class ProductController{
  constructor(private readonly ProductService: ProductService) {}

  @Get()
  getProducts(): product[]{
    return this.ProductService.getProducts();
  }
}