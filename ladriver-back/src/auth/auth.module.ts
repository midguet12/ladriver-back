import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { SequelizeModule } from "@nestjs/sequelize";
import { User } from './user.model';
import { JwtModule } from '@nestjs/jwt';



@Module({
    imports: [
        SequelizeModule.forFeature([User]),
        JwtModule.register({
            secret: process.env.SESSION_KEY || 'my-secret-key', // Use environment variables for security
            signOptions: { expiresIn: '1h' }, // Token expiration time
        }),

    ],
    controllers: [AuthController],
    providers: [AuthService],
})

export class AuthModule{};