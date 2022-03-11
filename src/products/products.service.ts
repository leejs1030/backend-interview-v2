import { Injectable } from '@nestjs/common';
import { atomictask, filtering, product, sorting } from 'custom-type';
import db from 'src/lib/dbconnection';
import { toPostgres } from 'src/lib/usefulJS';

import pgp from 'pg-promise';

const andProps = obj => ({
  rawType: true,
  toPostgres: () => Object.keys(obj).map(k => {
      const val = obj[k];
      if (val === null || val === undefined) {
          return pgp.as.format('$1:name IS NULL', [k]);
      }
      // if (Array.isArray(obj[k])){
      //   console.log(obj[k]);
      //   return pgp.as.format('$1:name in $2:csv', [k, val]);
      // }
      return pgp.as.format('$1:name = $2', [k, val]);
  }).join(' AND ')
});


@Injectable()
export class ProductService {
  /**
   * 
   * @param task 
   * db 커넥션 하나로
   * @returns 
   * 제품마다 기본 정보(이름, 설명, 브랜드, 가격, 색상), 좋아요 수 를 가진 정보 줌
   * 그러면 리스트 만들어서 리턴
   */
  async getProducts(filterObj?: filtering, sortObj?: sorting, task: atomictask = db): Promise<product[]>{
    let SQL = `SELECT id, name, brand, price, color, likes
    FROM products `;
    if(filterObj){
      SQL += 'WHERE ';
      let arr: string[] = [];
      if(filterObj.brand) arr.push(pgp.as.format('$1:name IN ($2:csv)', ['brand', filterObj.brand]));
      if(filterObj.maxPrice) arr.push(pgp.as.format('$1:name <= $2', ['price', filterObj.maxPrice]));
      if(filterObj.minPrice) arr.push(pgp.as.format('$1:name >= $2', ['price', filterObj.minPrice]));
      SQL += arr.join(' AND ');
    }
    if(sortObj){
      SQL += pgp.as.format(' ORDER BY ${order:name} ' + sortObj.direction, sortObj);
    }
    console.log(SQL);
    return await task.any(SQL + ';');
  }

  /**
   * 특정 제품의 상세한 정보를 보여줌
   * 
   * @param id 
   * 제품 id
   * @param task 
   * db 커넥션 하나로
   * @returns 
   * 상세한 제품 내역.
   * 기본 정보(이름, 설명, 브랜드, 가격, 색상)
   * 좋아요 수, 사이즈 종류
   */
  async getProductInfo(id: number, task: atomictask = db): Promise<product>{
    const sql = 'SELECT * FROM products WHERE id = $1';
    const sizes = await this.getSizes(id, task);
    try{
      const result = await task.one(sql, id); // 찾음
      result.sizes = sizes;
      return result;
    } catch(err){
      console.log(err);
      return {id: -1, name:"error", description: "Can't find product!"}; // 못 찾음(task.one이기에 레코드가 0개면 오류)
    }
  }

  /**
   * 제품 id에 맞는 사이즈 리스트 리턴
   * @param id 
   * @param task 
   * @returns 
   */
  async getSizes(id: number, task: atomictask = db): Promise<string[]>{
    const sql = 'SELECT size FROM sizes WHERE id = $1';
    try{
      const result = await task.any(sql, id);
      return result.map(e => e.size);
    } catch(err){
      console.log(err);
      throw err;
    }
  }
}
