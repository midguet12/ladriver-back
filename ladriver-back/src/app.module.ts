import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './auth/user.model';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { WebhookModule } from './webhook/webhook.module';
import { chat } from './chat/chat.model';
import { chatmodule } from './chat/chat.module';



@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    AuthModule,
    WebhookModule,
    chatmodule,
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>({
        dialect: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASS'),
        database: configService.get<string>('DB_NAME'),
        models: [User, chat],
        define: {
          timestamps: false,
        },
        autoLoadModels: true,
        synchronize: true
      })
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
