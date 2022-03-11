import { Body, Controller, Delete, Get, Header, HttpCode, Param, Patch, Post, Put, Query, Res } from '@nestjs/common';
import {Response} from 'express';
import { filtering, product, sorting } from 'custom-type';
import { ProductService } from './products.service';

@Controller('products')
export class ProductController{
  constructor(private readonly ProductService: ProductService) {}

  @Get() @HttpCode(200) @Header('content-type', 'application/hal+json')
  async getProducts(@Query('brand') brand: string | string[],
  @Query('minPrice') minPrice: string, @Query('maxPrice') maxPrice: string,
  @Query('likes') likes: string, @Query('order') order: string,
  @Query('direction') direction: string):
  Promise<{data: product[], _links: any}>{ // 상품 리스트

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
    ret.map(e => e._links = [{
      rel:'contents',
      href: '/products/' + e.id,
      type: 'GET',
    }]);
    const result = {
      data: ret,
      _links: [{
        rel: 'self',
        href: '/products',
        type: 'GET',
      }]
    }
    return result;
  }

  @Post()
  @HttpCode(201)
  @Header('content-type', 'application/hal+json')
  async makeProduct(@Body() body: any, @Res() res: Response): Promise<number | any>{
    if(false) return 1; // 권한 체크 필요
    const name = (body.name === undefined || body.name === null) ? null : body.name as string;
    const brand = (body.brand === undefined || body.brand === null) ? null : body.brand as string;
    const price = (body.price === undefined || body.price === null) ? null : parseInt(body.price as string);
    const color = (body.color === undefined || body.color === null) ? null : body.color as string;
    const description = (body.description === undefined || body.description === null) ? null : body.description as string;
    const sizes: {size: string}[] | null = (body.sizes === undefined || body.sizes === null) ? null : body.sizes;
    const ret = await this.ProductService.addProduct(name, brand, price, color, description, sizes);
    const result = {
      data: ret,
      _links: [
        {
          rel: 'self',
          href: '/products',
          type: 'POST',
        }
      ]
    }
    res.set('Location', '/products' + ret.id);
    res.json(result);
    return result;
  }

  @Get('/:id')
  @HttpCode(200)
  @Header('content-type', 'application/hal+json')
  async getProductInfo(@Param('id') productId: string, @Res() res: Response
  ): Promise<{data: product, _links: any}>{ // 상품 상세
    const ret = await this.ProductService.getProductInfo(parseInt(productId));
    const result = {
      data: ret,
      _links: [
        {
          rel: 'self',
          href: '/products/' + productId,
          type: 'GET',
        },
        {
          rel: 'parent',
          href: '/products',
          type: 'GET',
        }
      ]
    }
    if(ret.id === -1) res.status(404);
    res.json(result);
    return result;
  }

  @Put('/:id')
  @HttpCode(200)
  @Header('content-type', 'application/hal+json')
  async updateProduct(@Body() body: any, @Param('id') productId: string, @Res() res: Response): Promise<any>{
    let ret: product;
    
    if(body.id || body.likes) return res.status(400).send('You cannot change this!');

    ret = await this.ProductService.updateProduct(body, parseInt(productId));
    
    const result = {
      data: ret,
      _links: [
        {
          rel: 'self',
          href: '/products/' + productId,
          type: 'PATCH',
        }
      ]
    }
    res.status(200).json(result);
    return result;
  }
  

  @Delete('/:id')
  @HttpCode(200)
  @Header('content-type', 'application/hal+json')
  async deleteProduct(@Param('id') productId: string): Promise<any>{
    
  }

}