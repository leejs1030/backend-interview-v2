import { Injectable } from '@nestjs/common';
import { atomictask, filtering, product, sorting } from 'custom-type';
import db from '../lib/dbconnection';
import pgp from 'pg-promise';



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
    async getProducts(filterObj?: filtering, sortObj?: sorting, task: atomictask = db): Promise<product[]> {
        let SQL = `SELECT id, name, brand, price, color, likes
    FROM products `;
        if (filterObj !== undefined) {
            SQL += 'WHERE ';
            let arr: string[] = [];
            if (filterObj.brand === 'NULL') arr.push(pgp.as.format('$1:name IS NULL', ['brand']));
            else if (filterObj.brand) arr.push(pgp.as.format('$1:name IN ($2:csv)', ['brand', filterObj.brand]));
            if (filterObj.maxPrice) arr.push(pgp.as.format('$1:name <= $2', ['price', filterObj.maxPrice]));
            if (filterObj.minPrice) arr.push(pgp.as.format('$1:name >= $2', ['price', filterObj.minPrice]));
            if (filterObj.likes) arr.push(pgp.as.format('$1:name >= $2', ['likes', filterObj.likes]));
            SQL += arr.join(' AND ');
        }
        if (sortObj !== undefined) {
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
    async getProductInfo(id: number, task: atomictask = db): Promise<product> {
        const sql = 'SELECT * FROM products WHERE id = $1';
        const sizes = await this.getSizes(id, task);
        try {
            const result = await task.one(sql, id); // 찾음
            result.sizes = sizes;
            return result;
        } catch (err) {
            console.log(err);
            return { id: -1, name: "error", description: "Can't find product!" }; // 못 찾음(task.one이기에 레코드가 0개면 오류)
        }
    }

    /**
     * 제품 id에 맞는 사이즈 리스트 리턴
     * @param id 
     * @param task 
     * @returns 
     */
    async getSizes(id: number, task: atomictask = db): Promise<string[]> {
        const sql = 'SELECT size FROM sizes WHERE id = $1';
        try {
            const result = await task.any(sql, id);
            return result.map(e => e.size);
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    async addProduct(name: string, brand: string | null, price: number | null, color: string | null, description: string | null,
        sizes: { size: string }[] | null, task: atomictask = db): Promise<{ product: product, sizes: { size: string }[] }> {
        const insertSQL = pgp().helpers.insert({ name: name, brand: brand, price: price, color: color, description: description }, null, 'products')
            + ' RETURNING *';
        return await task.tx(async t => {
            const ret: product = await t.one(insertSQL);
            if (sizes === null) return { product: ret, sizes: [] };
            const idSizes = sizes.map(e => {
                return {
                    id: ret.id,
                    size: e.size,
                };
            })
            const sizeSQL = pgp().helpers.insert(idSizes, ['id', 'size'], 'sizes') + ' RETURNING size';
            const sizeret = await t.any(sizeSQL);
            return { product: ret, sizes: sizeret };
        })
    }

    async updateProduct(body: product, productId: number, task: atomictask = db) {
        const productSQL = pgp().helpers.update(body, null, 'products') +
            ' WHERE id = $1 RETURNING *';
        return await task.one(productSQL, [productId]);
    }

    async deleteProduct(productId: number, task: atomictask = db) {
        return await task.none('DELETE FROM products WHERE id = $1', [productId]);
    }

    
}
