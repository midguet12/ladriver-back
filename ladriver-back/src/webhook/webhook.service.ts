import { Injectable } from '@nestjs/common';

@Injectable()
export class WebhookService {
    handleEvent(payload: any): void {
        // Implement your webhook event handling logic here
        console.log('Received webhook payload:', payload);
    }
}