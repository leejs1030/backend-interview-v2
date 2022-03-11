declare module 'custom-type'{
  export type product = {
    id: number,
    name: string,
    brand?: string,
    price?: number,
    size?: string,
    color?: string,
    description?: string,
    likes?: number,
    sizes?: string[],
  }



  export type filtering = {
    brand?: string | string[],
    minPrice?: number,
    maxPrice?: number,
    likes?: number,
  }

  export type sorting = {
    order?: string,
    direction?: string,
  }

  // export type property = 'name' | 'brand' | 'price' | 'size' | 'color';

  
  import pgPromise from 'pg-promise';
  import pg from 'pg-promise/typescript/pg-subset';
  export type atomictask = (pgPromise.IDatabase<{}, pg.IClient> | pgPromise.ITask<{}>);
}