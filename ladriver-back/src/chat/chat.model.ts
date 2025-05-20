import { Column, Model, Table, PrimaryKey } from 'sequelize-typescript';

@Table ({tableName:'message'})
export class chat extends Model {
  @Column
  username: string;

  @Column
  text: string;
}