import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BinanceService } from 'src/binance/service/binance.service';
import { Estimation } from '../entities/estimation.entity';
import { EstimatePriceDto } from '../dto/estimate-price.dto';
import { ExecuteSwapDto } from '../dto/execute-swap.dto';
import { Swap } from '../entities/swap.entity';
import { environments } from 'src/environments/environmets';

@Injectable()
export class SwapService {
  private readonly binanceFee = environments.binanceFee;
  private readonly beloFee = environments.beloFee;

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
  }: EstimatePriceDto): Promise<Estimation> {
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
        estimatedPrice: price.toFixed(2),
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
      return price * (1 + totalFees);
    } else {
      return price * (1 - totalFees);
    }
  }

  async executeSwap({ estimationId }: ExecuteSwapDto): Promise<Swap> {
    try {
      const estimation = await this.estimationRepository.findOne({
        where: { id: estimationId },
      });

      const { pair, volume, operation, estimatedPrice: price } = estimation;

      if (!estimation) {
        throw new Error('Estimation not found');
      }

      if (new Date() > estimation.validUntil) {
        throw new Error('Estimation expired');
      }

      const orderResult = await this.binanceService.newOrder(
        pair,
        operation,
        'LIMIT',
        volume,
        price,
      );
      const swap = this.swapRepository.create({
        pair,
        volume,
        price,
        orderId: orderResult.orderId,
      });

      await this.swapRepository.save(swap);

      return swap;
    } catch (error) {
      throw new HttpException(
        error.message || 'Error executing swap',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
