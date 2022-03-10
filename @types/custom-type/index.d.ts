declare module 'custom-type'{
  export type product = {
    id: number,
    name?: string,
    description?: string,
    brand?: string,
    price?: number,
    size?: string|number,
    color?: string,
  }


  export type filter = {
    
  }

  export type property = 'name' | 'brand' | 'price' | 'size' | 'color';

  
  import pgPromise from 'pg-promise';
  import pg from 'pg-promise/typescript/pg-subset';
  export type atomictask = (pgPromise.IDatabase<{}, pg.IClient> | pgPromise.ITask<{}>);
}