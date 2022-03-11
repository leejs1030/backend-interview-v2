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
})