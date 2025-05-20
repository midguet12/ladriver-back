import {Injectable, NotFoundException} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { chat } from './chat.model';
import { Sequelize } from 'sequelize-typescript';
import { chatdto } from './chat.dto';
import { promises } from 'dns';
@Injectable({})
export class chatservice{
    constructor(
        @InjectModel(chat)
        private chatModel: typeof chat,
        private sequelize:Sequelize
    ) {}

    //funcion GET
    async findAll(): Promise<chat[]> {
        return this.chatModel.findAll();
    }

    //funcion GET por ID
    async findOne(id: string): Promise<chat> {
        const tabid = await this.chatModel.findOne({where: {id,},});
        if(!tabid){
            throw new NotFoundException('ID no encontrado')
        }
        return tabid
      }

    //funcion GET por USERNAME
    async findusername(username: string): Promise<chat[]> {
        const usuario = await this.chatModel.findAll({where: {username,},});
        if(!usuario){
            throw new NotFoundException('usuario no encontrado')
        }
        return usuario;
      }



    //funcion POST
    async createmessages(createmessages: chatdto): Promise<chat>{
        return await this.chatModel.create<chat>(createmessages as any)
    }

    //funcion PUT
    async updatemessage(id: number,chatdto: chatdto): Promise<chat>{
        const tabid = await this.chatModel.findByPk(id);
        if(!tabid){
            throw new NotFoundException('ID no encontrado')
        }
        return tabid.update(chatdto);
    }

    //funcion DELETE
    async deletemessage(id: string): Promise<void>{
        const tabid = await this.chatModel.findOne({where: {id,},});
        if(!tabid){
            throw new NotFoundException('ID no encontrado')
        }
        await tabid.destroy();
    }
}