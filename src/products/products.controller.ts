import { Body, Controller, Delete, Get, Header, HttpCode, Param, Patch, Post, Query } from '@nestjs/common';
import { filtering, product, sorting } from 'custom-type';
import { ProductService } from './products.service';
import db from 'src/lib/dbconnection';

@Controller('products')
export class ProductController{
  constructor(private readonly ProductService: ProductService) {}

  @Get()
  @HttpCode(200)
  @Header('content-type', 'application/hal+json')
  async getProducts(@Query('brand') brand: string | string[],
  @Query('minPrice') minPrice: string,
  @Query('maxPrice') maxPrice: string,
  @Query('likes') likes: string,
  @Query('order') order: string,
  @Query('direction') direction: string): Promise<product[]>{ // 상품 리스트
    const filterObj: filtering = new Object();
    const sortObj: sorting = new Object();

    let needFilter = false, needSort = false;
    if(brand !== undefined){
      filterObj.brand = brand; needFilter = true;
      if(typeof filterObj.brand == 'string') filterObj.brand = [filterObj.brand];
    }
    if(minPrice !== undefined){
      filterObj.minPrice = parseInt(minPrice); needFilter = true;
    }
    if(maxPrice !== undefined){
      filterObj.maxPrice = parseInt(maxPrice); needFilter = true;
    }
    if(likes !== undefined){
      filterObj.likes = parseInt(likes); needFilter = true;
    }
    if(order !== undefined){
      // sorting 기본값은 ASC. PSQL도 생략시 ASC임.
      sortObj.order = order; needSort = true;
      sortObj.direction = direction;
      if(!sortObj.direction || !(sortObj.direction.toUpperCase() === 'DESC' || sortObj.direction.toUpperCase() === 'ASC'))
        sortObj.direction = "ASC";

    }
    const ret = await this.ProductService.getProducts((needFilter) ? filterObj : undefined, (needSort) ? sortObj : undefined);
    return ret;
  }

  @Post()
  @HttpCode(201)
  @Header('content-type', 'application/hal+json')
  async makeProduct(@Body() body: any): Promise<any>{
    console.log(body);
    return 1;
  }
  
  @Get('/:id')
  @HttpCode(200)
  @Header('content-type', 'application/hal+json')
  async getProductInfo(@Param('id') productId: string): Promise<{data: product, _links: any}>{ // 상품 상세
    const ret = await this.ProductService.getProductInfo(parseInt(productId));
    const result = {
      data: ret,
      _links: {
        self: {
          href: "/products/" + productId,
        },
        products: {
          href: "/products",
        }
      }
    }
    return result;
  }

  @Patch('/:id')
  @HttpCode(200)
  @Header('content-type', 'application/hal+json')
  async updateProduct(@Body() body: any, @Param('id') productId: string): Promise<any>{
    
  }

  @Delete('/:id')
  @HttpCode(200)
  @Header('content-type', 'application/hal+json')
  async deleteProduct(@Param('id') productId: string): Promise<any>{
    
  }

}