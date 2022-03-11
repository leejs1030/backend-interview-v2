import { Controller, Post, UseGuards, Req, Body, Get } from '@nestjs/common';
import { user } from 'custom-type';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}
    
    @UseGuards(LocalAuthGuard)
    @Post('/sign-in')
    async login(@Req() req: Request, @Body() body: any) {
        console.log(req.user);
        console.log(body);

        return this.authService.login(req.user);
    }

    @Post('/sign-up')
    async signup(@Body() body: user) {
        return await this.authService.createUser(body);
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Req() req: Request) {
        console.log('hi');
        console.log(req.user);
        return req.user;
    }
}