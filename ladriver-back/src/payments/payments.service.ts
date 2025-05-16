import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Response } from 'express';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PaymentsService {
    constructor(private readonly httpService: HttpService) {}

    async createSuscription(email: string, res: Response){
        const url = process.env.MP_URL!;
        const fullUrl = url + 'preapproval_plan';
        const token = process.env.MP_TOKEN!;
        const back_url = process.env.MP_REDIRECT!;
        const payer_email = email;

        const currentDate = new Date();
        const billing_day = currentDate.getDate();

        const payload = {
            reason: email,
            auto_recurring: {
                frequency: 1,
                frequency_type: 'months',
                billing_day,
                billing_day_proportional: false,
                transaction_amount: 29,
                currency_id: 'MXN',
            },
            back_url,
            payer_email
        }


        const headers = {
            Authorization: `Bearer ${token}`,
            'Content-type': 'application/json',
        };

        const response = await firstValueFrom(
            this.httpService.post(fullUrl, payload, {headers})
        )

        return res.status(201).json({
            init_point: response.data.init_point
        })
         
    }
}