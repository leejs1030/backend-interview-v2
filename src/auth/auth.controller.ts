import { Controller, Post, UseGuards, Req, Body, Get, Res, Header, HttpCode } from '@nestjs/common';
import { user } from 'custom-type';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}
    
    @UseGuards(LocalAuthGuard)
    @Post('/sign-in')
    @Header('content-type', 'application/hal+json')
    async login(@Req() req: Request, @Body() body: any, @Res() res: Response) {
        const ret = await this.authService.login(req.user);
        res.status(200);
        const result = {
            data: ret,
            _links: [
                {
                    rel: "self",
                    href: "/auth/sign-in",
                    type: "POST",
                }
            ]
        }
        res.json(result);
    }

    @Post('/sign-up')
    @Header('content-type', 'application/hal+json')
    async signup(@Body() body: any, @Res() res: Response) {
        body = { id: body.username, password: body.password, nickname: body.nickname } as user;
        const ret = await this.authService.createUser(body);
        if(!ret) return res.status(409).send('ID already exists!');
        res.status(201);
        const result = {
            data: ret,
            _links:[
                {
                    rel: "self",
                    href: "/auth/sign-up",
                    type: "POST",
                }
            ]
        }
        return res.json(result);
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    @HttpCode(200)
    @Header('content-type', 'application/hal+json')
    getProfile(@Req() req: Request) {
        const ret = req.user;
        console.log(ret);
        const result = {
            data: ret,
            _links: [
                {
                    rel: "self",
                    href: "/auth/profile",
                    type: "GET",
                }
            ]
        }
        return result;
    }
}