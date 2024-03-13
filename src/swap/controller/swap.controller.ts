import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { SwapService } from '../service/swap.service';

@Controller('swap')
export class SwapController {
  constructor(private readonly swapService: SwapService) {}

  @Get('/estimate-price')
  async estimatePrice(
    @Query('pair') pair: string,
    @Query('volume') volume: number,
    @Query('operation') operation: 'BUY' | 'SELL',
  ) {
    const estimation = await this.swapService.estimatePrice(
      pair,
      volume,
      operation,
    );
    return {
      data: estimation,
    };
  }
}
