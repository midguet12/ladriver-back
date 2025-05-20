import {Body, Controller, Delete, Get, Param, Post, Put} from '@nestjs/common';
import { chatservice } from './chat.service';
import {chat} from './chat.model';
import { chatdto } from './chat.dto';

@Controller({})
export class chatcontroller{
    constructor (private chatservice: chatservice){}
    @Get ('/message')
    async getallchats(){
        return this.chatservice.findAll();
    }
    

    @Get ('/message/:id')
    async findOne(@Param('id')id: string): Promise<chat>{
        return this.chatservice.findOne(id);
    }

    @Get ('/message/user/:username')
    async findusername(@Param('username')username: string): Promise<chat[]>{
        return this.chatservice.findusername(username);
    }

    @Post ('/message')
    async createmessages(@Body()Body){
        return this.chatservice.createmessages(Body)
    }

    @Put ('/message/:id')
    async updatemessage(@Param('id') id: number, @Body() chatdto:chatdto): Promise<chat>{
        return this.chatservice.updatemessage(id,chatdto);
    }

    @Delete ('/message/:id')
    async deletemessage(@Param('id')id: string): Promise<void>{
        return this.chatservice.deletemessage(id);
    }
}