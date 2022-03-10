import { Injectable } from '@nestjs/common';
import { product } from 'custom-type';

@Injectable()
export class ProductService {
  getProducts(): product[]{
    return [{id: 1}];
  }
}
