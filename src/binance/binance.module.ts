import { Module } from '@nestjs/common';
import { BinanceService } from './service/binance.service';

@Module({
  providers: [BinanceService]
})
export class BinanceModule {}
