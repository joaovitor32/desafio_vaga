import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { TransactionService } from './transaction.service';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) { }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async createTransactions(@UploadedFile() file: any): Promise<any> {
    if (!file) {
      throw new Error('No file uploaded.');
    }

    const content = file.buffer.toString('utf-8');
    return this.transactionService.createTransactions(content);
  }
}
