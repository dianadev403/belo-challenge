import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Swap } from './entities/swap.entity';
import { Estimation } from './entities/estimation.entity';
import { SwapController } from './controller/swap.controller';
import { SwapService } from './service/swap.service';
import { BinanceService } from 'src/binance/service/binance.service';

@Module({
  imports: [TypeOrmModule.forFeature([Swap, Estimation])],
  controllers: [SwapController],
  providers: [SwapService, BinanceService],
})
export class SwapModule {}
