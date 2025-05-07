import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { ConfigService } from '@nestjs/config';
import { User } from "src/auth/user.model";
import { NestFactory } from "@nestjs/core";
import { AppModule } from 'src/app.module';
import {Response, Request} from 'express';
import { JwtService } from '@nestjs/jwt'




@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User) private readonly userModel: typeof User,
        private jwtServices: JwtService
    ){}

    

    async login(username: string, password: string, res: Response ) {
        
        const user = await this.userModel.findOne({where: {username}});
        if (!user) {
            throw new UnauthorizedException('Invalid username or password');
        }
        const isPasswordValid = password == user.dataValues.password ? true: false;
        if(!isPasswordValid){
            return  res.status(200).json({
                message: `Wrong password`,
                logged: false
            })
        }

        const userJSON = user.toJSON();
        delete userJSON.password;

        const token = await this.jwtServices.signAsync(
            { user: userJSON }, 
            {
                secret: process.env.SESSION_KEY,
                expiresIn: '1d' 
            } 
        );

        res.cookie('authToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', 
            maxAge: 60 * 60 * 1000,  
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        });

        return res.status(200).json({
            message: `User ${username} logged succesfully`,
            logged: true
        })
    }

    logout(response: Response){
        response.clearCookie('authToken');
        return response.status(200).json({ message: 'Logged out successfully' });
    }

    async decodeToken(token: string){
        try {
            return await this.jwtServices.verify(token, {secret: process.env.SESSION_KEY});
        } catch (error) {
            throw new UnauthorizedException('Invalid or expired token');
        }
    }

    getUser(request: Request): any{
        const cookie = request.cookies.authToken;

        if (!cookie) {
            throw new UnauthorizedException('No token provided');
        }
        try {
            return this.decodeToken(cookie);
        } catch {
            throw new UnauthorizedException('Invalid token');
        }
    }

    async checkIfUserExists(username){
        let exists = true;
        const existingUser = await User.findOne({
            where:{
                username
            }
        });

        if (existingUser === null) {
            exists = false;
        } else {
            exists = true;
        }
        
        return exists;

    }

    async checkIfUserExistsRequest(username){
        const exists = await this.checkIfUserExists(username);
        return {
            exists
        }
    }

    async createUser(username:string, password:string, sessionKey: string){
        const app = await NestFactory.create(AppModule);
        const configService = app.get(ConfigService);
        const sessionKeyEnv = configService.get<string>('SESSION_KEY');

        let response = { message: '', created: false, exists: false}

        const userExists = await this.checkIfUserExists(username);
        if (userExists) {
            response.message = `User ${username} already exists`;
            response.created = false;
            response.exists = userExists;

            return response
        }

        if (sessionKey == sessionKeyEnv) {
            await this.userModel.create({
                username: username,
                password: password
            });
            response.message = 'User was created';
            response.created = true;
            response.exists = false;

            return response

        } else {
            response.message = 'User was not created, check sessionKey';
            response.created = false;
            response.exists = false;

            return response
        }
        
    }

    async checkSessionKey(sessionKey: string){
        const app = await NestFactory.create(AppModule);
        const configService = app.get(ConfigService);
        const sessionKeyEnv = configService.get<string>('SESSION_KEY');

        let response = {correct: false}

        if (sessionKeyEnv == sessionKey) {
            response.correct = true;
        }
        return response;
    }
}