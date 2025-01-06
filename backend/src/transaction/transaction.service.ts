import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Users, UsersDocument } from '../user/user.schema';
import { Transaction, TransactionDocument } from './transaction.schema';

@Injectable()
export class TransactionService {
  constructor(
    @InjectModel(Users.name) private userModel: Model<UsersDocument>,
    @InjectModel(Transaction.name)
    private transactionModel: Model<TransactionDocument>,
  ) { }

  /**
   * Analisa as linhas de transações para objetos.
   * @param lines Linhas de transações em formato texto.
   * @returns Lista de transações analisadas.
   */
  private parseTransactions(lines: string[]): {
    id: string;
    nome: string;
    cpfCnpj: string;
    data: Date;
    valor: number;
  }[] {
    return lines.map((line) => {
      const fields = line.split(';').map((part) => part.split(':')[1]);
      const [idValue, nomeValue, cpfCnpjValue, dataValue, valorValue] = fields;

      if (!nomeValue || !cpfCnpjValue || !dataValue || !valorValue) {
        throw new BadRequestException('Invalid transaction format');
      }

      return {
        nome: nomeValue.trim(),
        cpfCnpj: cpfCnpjValue.trim(),
        data: new Date(dataValue.trim()),
        valor: parseFloat(valorValue.trim()),
        id: idValue,
      };
    });
  }

  /**
   * Retorna o ID do usuário, criando-o se necessário.
   * @param nome Nome do usuário.
   * @param cpfCnpj CPF ou CNPJ do usuário.
   * @returns ID do usuário.
   */
  private async getOrCreateUser(nome: string, cpfCnpj: string): Promise<any> {
    const existingUser = await this.userModel.findOne({ nome, cpfCnpj });

    if (existingUser) {
      return existingUser._id;
    }

    const newUser = new this.userModel({ nome, cpfCnpj });
    const savedUser = await newUser.save();

    return savedUser._id;
  }

  /**
   * Processa o conteúdo fornecido para criar transações.
   * @param content String contendo as transações separadas por linhas.
   * @returns Lista de transações criadas.
   */
  async createTransactions(content: string): Promise<any[]> {
    // Divide o conteúdo em linhas não vazias
    const lines = content.split('\n').filter((line) => line.trim() !== '');

    // Processa as linhas em objetos de transação
    const parsedTransactions = this.parseTransactions(lines);

    try {
      const transactionsToInsert = [];

      for (const transaction of parsedTransactions) {
        const userId = await this.getOrCreateUser(
          transaction.nome,
          transaction.cpfCnpj,
        );

        // Verifica se a transação já existe no banco de dados
        const existingTransaction = await this.transactionModel.findOne({
          userId,
          data: transaction.data,
          valor: transaction.valor,
        });

        if (!existingTransaction) {
          transactionsToInsert.push({
            userId,
            transactionId: transaction.id,
            data: transaction.data,
            valor: transaction.valor,
          });
        }
      }

      // Insere transações únicas no banco
      if (transactionsToInsert.length > 0) {
        return this.transactionModel.insertMany(transactionsToInsert);
      }

      return [];
    } catch (err) {
      console.error('Error creating transactions:', err);
      throw new BadRequestException('Error creating transactions.');
    }
  }
}
