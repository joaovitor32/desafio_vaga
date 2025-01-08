import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model } from 'mongoose';
import { Users, UsersDocument } from '../user/user.schema';
import { Transactions, TransactionsDocument } from './transactions.schema';
import { splitContent } from 'src/utils/file';
import { ParsedTransaction } from './types';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Users.name) private userModel: Model<UsersDocument>,
    @InjectModel(Transactions.name)
    private transactionModel: Model<TransactionsDocument>,
  ) { }

  private parseTransactions(lines: string[]): ParsedTransaction[] {
    return lines.map((line) => {
      const fields = line.split(';').map((part) => part.split(':')[1]?.trim());
      const [id, nome, cpfCnpj, data, valor] = fields;

      if (!id || !nome || !cpfCnpj || !data || !valor) {
        throw new Error('Missing required fields');
      }

      return {
        id,
        nome,
        cpfCnpj,
        data: new Date(data),
        valor: parseFloat(valor),
      };
    });
  }

  private async findOrCreateUser(
    nome: string,
    cpfCnpj: string,
    session?: ClientSession,
  ): Promise<any> {
    const options = session ? { session } : {};
    const existingUser = await this.userModel.findOne(
      { cpfCnpj },
      null,
      options,
    );

    if (existingUser) {
      return existingUser._id;
    }

    const newUser = new this.userModel({
      nome,
      cpfCnpj,
      createdAt: new Date(),
    });

    const savedUser = await newUser.save(options);
    return savedUser._id;
  }

  private async processTransactions(
    transactions: ParsedTransaction[],
    session: ClientSession,
  ): Promise<any[]> {
    const transactionsToInsert = [];
    const userPromises = new Map<string, Promise<string>>();

    for (const transaction of transactions) {
      // Gera uma chave única para identificar o usuário baseado no nome e CPF/CNPJ,
      // verifica se já existe uma Promise associada a essa chave no Map (para evitar chamadas redundantes),
      // cria uma nova Promise para buscar ou criar o usuário caso ainda não exista,
      // e a reutiliza para garantir consistência e eficiência ao obter o ID do usuário.
      const userKey = `${transaction.nome}_${transaction.cpfCnpj}`;

      if (!userPromises.has(userKey)) {
        userPromises.set(
          userKey,
          this.findOrCreateUser(transaction.nome, transaction.cpfCnpj, session),
        );
      }

      const userId = await userPromises.get(userKey);

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

    return transactionsToInsert;
  }

  async createTransactions(content: string): Promise<any[]> {
    const lines = splitContent(content);
    const parsedTransactions = this.parseTransactions(lines);

    const session = await this.transactionModel.db.startSession();
    session.startTransaction();

    try {
      const transactionsToInsert = await this.processTransactions(
        parsedTransactions,
        session,
      );

      if (transactionsToInsert.length > 0) {
        await this.transactionModel.insertMany(transactionsToInsert, {
          session,
        });
      }

      await session.commitTransaction();
      return transactionsToInsert;
    } catch (error) {
      await session.abortTransaction();
      throw new BadRequestException(
        'Error creating transactions',
        error.message || error,
      );
    } finally {
      session.endSession();
    }
  }

  async findTransactions(
    nome?: string,
    cpfCnpj?: string,
    dataInicial?: Date,
    dataFinal?: Date,
    valor?: number,
    page = 1,
    limit = 10,
  ) {
    const filter: Record<string, any> = await this.buildFilters(
      nome,
      cpfCnpj,
      dataInicial,
      dataFinal,
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
      .sort({ data: 1 })
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
    dataInicial?: Date,
    dataFinal?: Date,
    valor?: number,
  ) {
    const filter: Record<string, any> = {};

    // Essa parte de reter informações do usuário relacionado ao filtro pode
    // ser aprimorado
    if (nome?.trim() || cpfCnpj?.trim()) {
      const user = await this.getUserByNameOrCpfCnpj(nome, cpfCnpj);
      filter['userId'] = user?._id;
    }

    if (dataInicial || dataFinal) {
      filter['data'] = {};
      if (dataInicial) {
        filter['data'].$gte = dataInicial;
      }
      if (dataFinal) {
        filter['data'].$lte = dataFinal;
      }
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
