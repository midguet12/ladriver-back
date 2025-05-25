import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Response } from 'express';
import { firstValueFrom } from 'rxjs';
import { Suscription } from './suscription.model';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class PaymentsService {
    constructor(
        private readonly httpService: HttpService,
        @InjectModel(Suscription) private readonly subscriptionModel: typeof Suscription
    ) {}

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

    async saveSuscription(preapproval_id: string, username: string){
        await this.subscriptionModel.create({
            preapproval_id,
            username
        });

        return {message: 'Subscription saved successfully'};
    }

    async validateSuscription(preapproval_id: string){
        const url = process.env.MP_URL!;
        const fullUrl = url + 'preapproval/' + preapproval_id;
        const token = process.env.MP_TOKEN!;

        const headers = {
            Authorization: `Bearer ${token}`,
            'Content-type': 'application/json',
        };

        const response = await firstValueFrom(
            this.httpService.get(fullUrl, {headers})
        )

        return response.data.status === 'authorized' ? {status: true} : {status: false};   
    }

    async getSuscription(username: string){
        const suscription = await this.subscriptionModel.findOne({
            where: {
                username
            }
        });

        if (!suscription) {
            return {message: 'Subscription not found'};
        }

        const plainSuscription = suscription.get({ plain: true });


        const url = process.env.MP_URL!;
        const fullUrl = url + 'preapproval/' + plainSuscription.preapproval_id;
        const token = process.env.MP_TOKEN!;

        const headers = {
            Authorization: `Bearer ${token}`,
            'Content-type': 'application/json',
        };

        const response = await firstValueFrom(
            this.httpService.get(fullUrl, {headers})
        )
    
        if (response.data.status === 'authorized') {
            return {status: true};
        } else {
            return {status: false};
        }
    }
}