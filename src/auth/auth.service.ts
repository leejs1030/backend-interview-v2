import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { atomictask, user } from 'custom-type';
import db from 'src/lib/dbconnection';
import { generatePassword, verifyPassword } from 'src/lib/passwords';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService, private jwtService: JwtService) {}

    async validateUser(id: string, password: string): Promise<any> {
        const user = await this.usersService.getUserById(id);
        if (user && await verifyPassword(password, user.password as string)) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any){
        const payload = { username: user.id, sub: user.nickname };
        console.log(payload); console.log(user);
        return { access_token: this.jwtService.sign(payload) };
    }

    async createUser(user: user, task:atomictask = db){
        if((await this.usersService.getUserById(user.id))) return false;
        user.password = await generatePassword(user.password);
        return await task.one('INSERT INTO users VALUES(${id}, ${password}, ${nickname}) RETURNING *', user);
    }
}