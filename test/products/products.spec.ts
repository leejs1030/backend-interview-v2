import * as chai from "chai";
import chaiHttp = require('chai-http');
import 'mocha';
import db from '../../src/lib/dbconnection';
import { AppModule } from '../../src/app.module';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';

chai.use(chaiHttp);
let chaiLib = <any>chai;
let chaiRequestLib = chaiLib.default.request;

describe('Test products', () =>{
    let app: INestApplication;

    beforeEach(async () => {
      const module = await Test.createTestingModule({
        imports: [AppModule],
      }).compile();
      app = module.createNestApplication();
      await app.init();
    });
  
    afterEach(async () => {
      await app.close();
    });
  
    it('products test', async () =>{
        const ret = await chaiRequestLib(app.getHttpServer()).get('/products');
    })
})