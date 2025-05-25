import { Controller, Get, Post, Body, Param, Res } from '@nestjs/common';
import {PaymentsService} from './payments.service';
import { Response } from 'express';


@Controller('payments')
export class PaymentsController {

    private readonly paymentService: PaymentsService;
    constructor(paymentService: PaymentsService){
        this.paymentService = paymentService;
    }

    @Post('suscription')
    getSuscriptionLink(@Body() body, @Res() res: Response){
        return this.paymentService.createSuscription(body.email, res);
    }

    @Get('validatesuscription/:preapproval_id')
    validateSuscription(@Param('preapproval_id') preapproval_id: string){
        return this.paymentService.validateSuscription(preapproval_id);
    }

    
    @Post('createSuscription')
    createSuscription(@Body() body: { preapproval_id: string, username: string }) {
        return this.paymentService.saveSuscription(body.preapproval_id, body.username);
    }

    @Get('validateusersuscription/:username')
    getSuscription(@Param('username') username: string) {
        return this.paymentService.getSuscription(username);
    }
}