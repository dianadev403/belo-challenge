import { Body, Controller, Get, Post, Query } from '@nestjs/common';

import { SwapService } from '../service/swap.service';
import { EstimatePriceDto } from '../dto/estimate-price.dto';
import { ExecuteSwapDto } from '../dto/execute-swap.dto';

@Controller('swap')
export class SwapController {
  constructor(private readonly swapService: SwapService) {}

  @Get('/estimate-price')
  async estimatePrice(@Query() query: EstimatePriceDto) {    
    const estimation = await this.swapService.estimatePrice(query);
    return {
      data: estimation,
    };
  }

  @Post('/execute')
  async executeSwap(@Body() executeSwapDto: ExecuteSwapDto) {    
    const swap = await this.swapService.executeSwap(executeSwapDto);
    return {
      data: swap,
    };
  }

}
