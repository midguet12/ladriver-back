import { Column, Model, Table } from 'sequelize-typescript';

@Table
export class Suscription extends Model {
    @Column
    preapproval_id: string;

    @Column
    username: string;
}   