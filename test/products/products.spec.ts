import * as chai from "chai";
import { expect } from "chai";
chai.use(require('chai-http'));
import 'mocha';
import { AppModule } from '../../src/app.module';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';

import db from '../../src/lib/dbconnection';

// let chaiLib = <any>chai;
// let chaiRequestLib = chaiLib.default.request;
let request = (chai as any).default.request;

describe('Test products', () =>{
    let app: INestApplication;
    let server: any;

    beforeEach(async () => {
      const module = await Test.createTestingModule({
        imports: [AppModule],
      }).compile();
      app = module.createNestApplication();
      server = app.getHttpServer();
      await app.init();
    });
  
    afterEach(async () => {
      await app.close();
    });
  
    it('products test', async () =>{
        const ret = await request(server).get('/products');
        console.log(ret.text);
        console.log(ret.header);
        expect(ret.status).equal(200);
        const obj = JSON.parse(ret.text);
        expect(obj.data.length).equal((await db.one('SELECT count(*)::int FROM products;')).count);
    });

    it('post test', async() => {
      const ret = await request(server).post('/products').set('content-type', 'application/x-www-form-urlencoded')
      .send({
        name: "super nice thing",
        brand: "brand new",
        price: "1",
        color: "rainbow",
        description: "super nice discount",
        sizes: [{size: "XXXXXXL"}, {size: "XXXXXXS"}],
      })
      .catch(err => {
        console.error(err);
      })
      console.log(ret.text);

      const reterr = await request(server).post('/products').set('content-type', 'application/x-www-form-urlencoded')
      .send({
        name: "super nice thing",
        brand: "brand new",
        price: "1000000000",
        color: "rainbow",
        description: "super no discount",
      })
      .catch(err => {
        console.error('second one!!!');
        console.error(err);
        throw err;
      })
      console.log(reterr.text);
    })

    it('put test', async () =>{
      const ret = await request(server).put('/products/35').set('content-type', 'application/x-www-form-urlencoded')
      .send({
        brand: "old brand",
        description: "do not buy",
        price: "99999999",
        id: "29438",
      }).catch(err => console.log("nice!"));
      console.log("If you don't have nice message just before this messgae, that will be bad!");
      const correctret = await request(server).put('/products/1').set('content-type', 'application/x-www-form-urlencoded')
      .send({
        brand: "remastered bag0",
        description: "better than before. discount!",
        price: "10000"
      })
    })
})