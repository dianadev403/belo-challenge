import { Body, Controller, Get, Post } from '@nestjs/common';

import { SwapService } from '../service/swap.service';
import { SwapOperationDto } from '../dto/swap-operation.dto';

@Controller('swap')
export class SwapController {
  constructor(private readonly swapService: SwapService) {}

  @Get('/estimate-price')
  async estimatePrice(@Body() swapOperationDto: SwapOperationDto) {
    const estimation = await this.swapService.estimatePrice(swapOperationDto);
    return {
      data: estimation,
    };
  }
}
