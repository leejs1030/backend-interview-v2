import { filtering, sorting } from 'custom-type';
import pgp from 'pg-promise';

const toPostgres = (filters: any) => {
    const keys = Object.keys(filters);
    const s = keys.map(k => {
        // if(Array.isArray(k)){
            console.log(k);
        // }
        return pgp.as.name(k) + ' = ${' + k + '}'
    }).join(' AND ');
    console.log(s);
    return pgp.as.format(s, filters);
}

export {toPostgres};