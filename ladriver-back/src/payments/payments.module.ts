import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { Suscription } from './suscription.model';
import { SequelizeModule } from '@nestjs/sequelize';


@Module({
    imports: [
        HttpModule,
        SequelizeModule.forFeature([Suscription])
    ],
    controllers: [PaymentsController],
    providers: [PaymentsService],
    exports: [],
})
export class PaymentsModule {}