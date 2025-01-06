import * as AutoIncrementFactory from 'mongoose-sequence';
import * as mongoose from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { HydratedDocument } from 'mongoose';

const AutoIncrement = AutoIncrementFactory(mongoose);

export type UsersDocument = HydratedDocument<Users>;

@Schema()
export class Users {
  @Prop({ unique: true })
  id: number;

  @Prop()
  name: string;

  @Prop()
  cpfCnpj: string;
}

export const UsersSchema = SchemaFactory.createForClass(Users);

// Aplicando o plugin AutoIncrement
UsersSchema.plugin(AutoIncrement, { inc_field: 'id' });
