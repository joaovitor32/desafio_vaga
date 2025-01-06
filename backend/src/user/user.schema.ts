import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { HydratedDocument } from 'mongoose';

export type UsersDocument = HydratedDocument<Users>;

@Schema({ timestamps: true })
export class Users {
  @Prop({ required: true })
  nome: string;

  @Prop({ required: true })
  cpfCnpj: string;
}

export const UsersSchema = SchemaFactory.createForClass(Users);
