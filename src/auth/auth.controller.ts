import { Body, Controller, Delete, Get, Header, HttpCode, Param, Patch, Post, Put, Query, Res } from '@nestjs/common';
import {Response} from 'express';
import { filtering, product, sorting } from 'custom-type';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController{
  constructor(private readonly AuthService: AuthService) {}

  @Post('sign-up') @Header('content-type', 'application/hal+json')
  async signUp(@Body() body: any){
    
  }
}