import * as mongoose from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { HydratedDocument } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export type TransactionDocument = HydratedDocument<Transaction>;

@Schema()
export class Transaction {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true })
  userId: mongoose.Types.ObjectId;

  @Prop({
    required: true,
    default: uuidv4,
  })
  transactionId: string;

  @Prop({ required: true })
  data: Date;

  @Prop({ required: true, type: mongoose.Schema.Types.Decimal128 })
  valor: mongoose.Schema.Types.Decimal128;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
