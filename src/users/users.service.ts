import { Injectable } from '@nestjs/common';
import { atomictask, user } from 'custom-type';
import db from 'src/lib/dbconnection';

@Injectable()
export class UsersService {
    async getUserById(id:string, task:atomictask = db): Promise<user>{
        return await task.oneOrNone('SELECT * FROM users WHERE id = $1', [id]);
    }
}
