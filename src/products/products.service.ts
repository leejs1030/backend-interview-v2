import { Injectable } from '@nestjs/common';
import { atomictask, product } from 'custom-type';
import db from 'src/lib/dbconnection';

@Injectable()
export class ProductService {
  async getProducts(task: atomictask = db): Promise<product[]>{
    return await db.any('SELECT * FROM products');
  }
}
