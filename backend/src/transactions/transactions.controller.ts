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
  //[Melhoria] - Fazer uso de NodeJS Streams
  async createTransactions(@UploadedFile() file: any): Promise<any> {
    if (!file) {
      throw new Error('No file uploaded.');
    }

    const startTime = performance.now(); // Inicia a medição de tempo

    const content = file.buffer.toString('utf-8');

    const result = await this.transactionsService.createTransactions(content);

    const endTime = performance.now(); // Finaliza a medição de tempo
    const duration = endTime - startTime; // Calcula a duração

    const executionTimeInSeconds = duration / 1000;

    console.log(
      `Tempo total de execução em segundos: ${executionTimeInSeconds}s`,
    );

    return {
      result,
      startTime,
      endTime,
      executionTime: `${executionTimeInSeconds.toFixed(4)}s`,
    };
  }

  @Get()
  async findTransactions(
    @Query('nome') nome?: string,
    @Query('cpfCnpj') cpfCnpj?: string,
    @Query('dataInicial') dataInicial?: Date,
    @Query('dataFinal') dataFinal?: Date,
    @Query('valor') valor?: number,
    @Query('page') page?: number,
  ): Promise<any> {
    return this.transactionsService.findTransactions(
      nome,
      cpfCnpj,
      dataInicial,
      dataFinal,
      valor,
      page,
    );
  }
}
