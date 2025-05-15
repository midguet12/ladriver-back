import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';

@Controller('webhook')
export class WebhookController {

    @Post()
    @HttpCode(HttpStatus.OK)
    handleWebhook(@Body() payload: any): string {
        console.log(payload)
        return 'Webhook received';
    }
}