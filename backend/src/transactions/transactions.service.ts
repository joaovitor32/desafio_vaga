import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model } from 'mongoose';
import { Users, UsersDocument } from '../user/user.schema';
import { Transactions, TransactionsDocument } from './transactions.schema';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Users.name) private userModel: Model<UsersDocument>,
    @InjectModel(Transactions.name)
    private transactionModel: Model<TransactionsDocument>,
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
  async getOrCreateUser(
    nome: string,
    cpfCnpj: string,
    session?: ClientSession, // Optional session for transactions
  ): Promise<any> {
    try {
      // Check if the user already exists
      const existingUser = await this.userModel.findOne(
        { cpfCnpj },
        null,
        session ? { session } : {},
      );

      if (existingUser) {
        return existingUser._id;
      }

      // Create a new user if not found
      const newUser = new this.userModel({
        nome,
        cpfCnpj,
        createdAt: new Date(),
      });

      // Save the new user to the database, respecting the session if provided
      const savedUser = await newUser.save({ session });
      return savedUser._id;
    } catch (error) {
      console.error('Error in getOrCreateUser:', error);
      throw new Error('Failed to get or create user.');
    }
  }

  /**
   * Processa o conteúdo fornecido para criar transações.
   * @param content String contendo as transações separadas por linhas.
   * @returns Lista de transações criadas.
   */
  async createTransactions(content: string): Promise<any[]> {
    const lines = content.split('\n').filter((line) => line.trim() !== '');

    const parsedTransactions = this.parseTransactions(lines);

    const session = await this.transactionModel.db.startSession();
    session.startTransaction();

    try {
      const transactionsToInsert = [];

      for (const transaction of parsedTransactions) {
        const userId = await this.getOrCreateUser(
          transaction.nome,
          transaction.cpfCnpj,
          session,
        );

        const existingTransaction = await this.transactionModel.findOne(
          {
            userId,
            data: transaction.data,
            valor: transaction.valor,
          },
          null,
          { session },
        );

        if (!existingTransaction) {
          transactionsToInsert.push({
            userId,
            transactionId: transaction.id,
            data: transaction.data,
            valor: transaction.valor,
          });
        }
      }

      if (transactionsToInsert.length > 0) {
        await this.transactionModel.insertMany(transactionsToInsert, {
          session,
        });
      }

      // Finaliza a transação
      await session.commitTransaction();
      return transactionsToInsert;
    } catch (err) {
      // Faz rollback em caso de erro
      await session.abortTransaction();
      console.error('Error creating transactions:', err);
      throw new BadRequestException('Error creating transactions.');
    } finally {
      // Libera a sessão
      session.endSession();
    }
  }

  async findTransactions(
    nome?: string,
    cpfCnpj?: string,
    data?: Date,
    valor?: number,
    page = 1,
    limit = 10,
  ) {
    const filter: Record<string, any> = await this.buildFilters(
      nome,
      cpfCnpj,
      data,
      valor,
    );

    const totalDocuments = await this.transactionModel.countDocuments(filter);
    const totalPages = Math.ceil(totalDocuments / limit);

    if (totalDocuments === 0) {
      throw new NotFoundException(
        'No transactions found with the given filters.',
      );
    }

    const transactions = await this.transactionModel
      .find(filter)
      .populate('userId')
      .lean()
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    return {
      data: transactions,
      pagination: {
        totalItems: totalDocuments,
        totalPages,
        currentPage: page,
        itemsPerPage: limit,
      },
    };
  }

  private async buildFilters(
    nome?: string,
    cpfCnpj?: string,
    data?: Date,
    valor?: number,
  ) {
    const filter: Record<string, any> = {};

    // Se nome ou cpfCnpj forem fornecidos, buscamos o usuário
    if (nome?.trim() || cpfCnpj?.trim()) {
      const user = await this.getUserByNameOrCpfCnpj(nome, cpfCnpj);
      filter['userId'] = user?._id;
    }

    if (data) {
      filter['data'] = data;
    }

    if (valor !== undefined) {
      filter['valor'] = { $eq: valor };
    }

    return filter;
  }

  private async getUserByNameOrCpfCnpj(nome?: string, cpfCnpj?: string) {
    const userFilter: Record<string, any> = {};

    if (nome?.trim()) {
      userFilter['nome'] = nome;
    }

    if (cpfCnpj?.trim()) {
      userFilter['cpfCnpj'] = cpfCnpj;
    }

    const user = await this.userModel.findOne(userFilter);

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    return user;
  }
}
