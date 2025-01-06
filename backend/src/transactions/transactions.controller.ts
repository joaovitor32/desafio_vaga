import {
  Controller,
  Get,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { TransactionsService } from './transactions.service';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) { }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async createTransactions(@UploadedFile() file: any): Promise<any> {
    if (!file) {
      throw new Error('No file uploaded.');
    }

    const content = file.buffer.toString('utf-8');
    return this.transactionsService.createTransactions(content);
  }

  @Get()
  async findTransactions(
    @Query('nome') nome?: string,
    @Query('cpfCnpj') cpfCnpj?: string,
    @Query('data') data?: Date,
    @Query('valor') valor?: number,
    @Query('page') page?: number,
  ): Promise<any> {
    return this.transactionsService.findTransactions(
      nome,
      cpfCnpj,
      data,
      valor,
      page,
    );
  }
}
