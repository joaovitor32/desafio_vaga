import { Transactions, TransactionsSchema } from './transactions.schema';
import { Users, UsersSchema } from '../user/user.schema';

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Transactions.name, schema: TransactionsSchema },
      { name: Users.name, schema: UsersSchema },
    ]),
  ],
  providers: [TransactionsService],
  controllers: [TransactionsController],
})
export class TransactionsModule { }
