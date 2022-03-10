import { Injectable } from '@nestjs/common';
import { atomictask, product } from 'custom-type';
import db from 'src/lib/dbconnection';

@Injectable()
export class ProductService {
  async getProducts(task: atomictask = db): Promise<product[]>{
    // 모든 제품들의 리스트를 가져옴
    return await task.any('SELECT * FROM products');
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
   * 기본 정보(이름, 설명, 브랜드, 가격, 사이즈, 색상)
   * 좋아요 수
   */
  async getProductInfo(id: number, task: atomictask = db): Promise<product>{
    const sql = 'SELECT * FROM products WHERE id = $1';
    const likes = await this.countLikes(id, task);
    const sizes = await this.getSizes(id, task);
    try{
      const result = await task.one(sql, id); // 찾음
      result.likes = likes; result.sizes = sizes;
      return result;
    } catch(err){
      console.log(err);
      return {id: -1, name:"error", description: "Can't find product!"}; // 못 찾음(task.one이기에 레코드가 0개면 오류)
    }
  }

  async countLikes(id: number, task: atomictask = db): Promise<number>{
    const sql = 'SELECT COUNT(*)::int as likes FROM likes WHERE likes.product_id = $1';
    try{
      return (await task.one(sql, id) as {likes: number}).likes;
    } catch(err){
      console.log(err);
      throw err;
    }
  }

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
