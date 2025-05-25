import { Controller, Get, Post, Req, Param, Query, Body, Session, ValidationPipe, UsePipes, Res, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './auth.dto';
import {Request, Response} from 'express';

@Controller('auth')
export class AuthController {
    constructor(private readonly authServices: AuthService){}

    @Post('login')
    login(@Body() body, @Res() res: Response) {
        return this.authServices.login(body.username, body.password, res);
    }

    @Post('logout')
    logout(@Res() response: Response){
        return this.authServices.logout(response);
    }

    @Get('me')
    async getUser(@Req() request: Request){
        return this.authServices.getUser(request);
    }

    @Post('signin')
    @UsePipes(new ValidationPipe())
    async createUser(@Body() body: CreateUserDto): Promise<any>{
        const {username, password, sessionKey} = body;
        const response = await this.authServices.createUser(username, password, sessionKey);
        return response
    }

    @Post('exists')
    async checkIfUserExists(@Body() body: {username: string}) : Promise<any>{
        return await this.authServices.checkIfUserExistsRequest(body.username);
    }

    @Get('exists/:username')
    async checkIfUserExistsWithParam(@Param() params: {username: string}) : Promise<any>{
        return await this.authServices.checkIfUserExistsRequest(params.username);
    }

    @Post('sessionkey')
    async checkSessionKey(@Body() body: {sessionKey: string}) : Promise<any>{
        return await this.authServices.checkSessionKey(body.sessionKey);
    }

}

