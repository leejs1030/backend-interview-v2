declare module 'custom-type'{
  export type product = {
    id: number,
    name: string,
    brand?: string,
    price?: number,
    size?: string,
    color?: string,
  }

  export type description = {
    id: number,
    description?: string,
  }


  // export type filter = {
    
  // }

  // export type property = 'name' | 'brand' | 'price' | 'size' | 'color';

  
  import pgPromise from 'pg-promise';
  import pg from 'pg-promise/typescript/pg-subset';
  export type atomictask = (pgPromise.IDatabase<{}, pg.IClient> | pgPromise.ITask<{}>);
}