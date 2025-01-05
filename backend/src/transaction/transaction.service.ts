import { Injectable } from '@nestjs/common';

@Injectable()
export class TransactionService {
  async createTransactions(content: string): Promise<any> {
    const lines = content.split('\n').filter((line) => line.trim() !== '');

    console.log(lines);

    return [];
  }
}
