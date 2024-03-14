import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BinanceService } from 'src/binance/service/binance.service';
import { Swap } from '../entities/swap.entity';
import { Estimation } from '../entities/estimation.entity';
import { SwapOperationDto } from '../dto/swap-operation.dto';

@Injectable()
export class SwapService {
  private readonly binanceFee: number = parseFloat(
    process.env.BINANCE_FEE_PERCENTAGE,
  );
  private readonly beloFee: number = parseFloat(
    process.env.BELO_FEE_PERCENTAGE,
  );
  private readonly defaultSpread: number = parseFloat(
    process.env.DEFAULT_SPREAD_PERCENTAGE,
  );

  constructor(
    private readonly binanceService: BinanceService,

    @InjectRepository(Estimation)
    private estimationRepository: Repository<Estimation>,

    @InjectRepository(Swap)
    private swapRepository: Repository<Swap>,
  ) {}

  async estimatePrice({
    pair,
    volume,
    operation,
  }: SwapOperationDto): Promise<any> {
    try {
      const orderBook = await this.binanceService.getOrderBook(pair);
      const { asks, bids } = orderBook;

      const orders = operation === 'BUY' ? asks : bids;

      let totalVolume = 0;
      let totalCost = 0;

      for (let i = 0; i < orders.length; i++) {
        const order = orders[i];
        const orderPrice = parseFloat(order[0]);
        const orderVolume = parseFloat(order[1]);
        const neededVolume = volume - totalVolume;

        if (orderVolume < neededVolume) {
          totalCost += orderPrice * orderVolume;
          totalVolume += orderVolume;
        } else {
          totalCost += orderPrice * neededVolume;
          totalVolume += neededVolume;
          break;
        }
      }

      const priceAdjustedByVolume = totalCost / totalVolume;
      const price = this.adjustPrice(priceAdjustedByVolume, operation);

      const expiration = 5 * 60 * 1000;
      const validUntil = new Date(Date.now() + expiration);

      const estimation = this.estimationRepository.create({
        pair,
        volume,
        operation,
        estimatedPrice: price,
        validUntil,
      });

      await this.estimationRepository.save(estimation);

      return estimation;
    } catch (error) {
      throw new HttpException(
        error.message || 'Error estimating price',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private adjustPrice(price: number, operation: 'BUY' | 'SELL'): number {
    let totalFees = this.binanceFee + this.beloFee;
    if (operation === 'BUY') {
      return price * (1 + totalFees + this.defaultSpread);
    } else {
      return price * (1 - totalFees - this.defaultSpread);
    }
  }
}
