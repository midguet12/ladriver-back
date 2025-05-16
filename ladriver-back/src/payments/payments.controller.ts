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

    @Get(':id')
    findOne(@Param('id') id: string) {
        // Return a single payment by id (mock)
        return { id, amount: 100 };
    }

    @Post()
    create(@Body() createPaymentDto: any) {
        // Create a new payment (mock)
        return { id: 2, ...createPaymentDto };
    }
}