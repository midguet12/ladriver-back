import {Module} from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { chat } from './chat.model';
import { chatcontroller } from './chat.controller';
import { chatservice } from './chat.service';
@Module({
    imports: [SequelizeModule.forFeature([chat])],
    controllers: [chatcontroller],
    providers:[chatservice]
})
export class chatmodule{}