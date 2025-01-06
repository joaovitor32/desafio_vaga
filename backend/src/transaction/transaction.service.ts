import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { Transaction } from './transaction.schema';
import { Users } from 'src/user/user.schema';

@Injectable()
export class TransactionService {
  constructor(
    @InjectModel(Users.name) private userModel: Model<Users>,
    @InjectModel(Transaction.name) private transactionModel: Model<Transaction>,
    @InjectConnection() private readonly connection: Connection,
  ) { }

  async createTransactions(content: string): Promise<any[]> {
    const lines = content.split('\n').filter((line) => line.trim() !== '');
    const transactions = lines.map((line) => {
      const fields = line.split(';').map((part) => part.split(':')[1]);
      const [idValue, nomeValue, cpfCnpjValue, dataValue, valorValue] = fields;

      if (
        !idValue ||
        !nomeValue ||
        !cpfCnpjValue ||
        !dataValue ||
        !valorValue
      ) {
        throw new BadRequestException('Invalid transaction format');
      }

      return {
        id: idValue,
        nome: nomeValue,
        cpfCnpj: cpfCnpjValue,
        data: dataValue,
        valor: parseFloat(valorValue),
      };
    });

    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      for (const transaction of transactions) {
        const existingUser = await this.userModel.findOne({
          cpfCnpj: transaction.cpfCnpj,
        });

        if (existingUser) continue;

        const newUser = new this.userModel({
          nome: transaction.nome,
          cpfCnpj: transaction.cpfCnpj,
        });

        newUser.save({ session });
      }

      await session.commitTransaction();
      session.endSession();

      return transactions;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }
}
