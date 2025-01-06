import * as mongoose from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { HydratedDocument } from 'mongoose';

export type TransactionDocument = HydratedDocument<Transaction>;

@Schema()
export class Transaction {
  @Prop({ required: true, unique: true })
  id: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true })
  userId: mongoose.Types.ObjectId;

  @Prop({ required: true })
  transactionId: number;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true, type: mongoose.Schema.Types.Decimal128 })
  valor: mongoose.Schema.Types.Decimal128;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
