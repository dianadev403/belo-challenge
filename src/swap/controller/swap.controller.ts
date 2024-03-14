import { Body, Controller, Get, Post, Query } from '@nestjs/common';

import { SwapService } from '../service/swap.service';
import { SwapOperationDto } from '../dto/swap-operation.dto';

@Controller('swap')
export class SwapController {
  constructor(private readonly swapService: SwapService) {}

  @Get('/estimate-price')
  async estimatePrice(@Query() query: SwapOperationDto) {    
    const estimation = await this.swapService.estimatePrice(query);
    return {
      data: estimation,
    };
  }

}
