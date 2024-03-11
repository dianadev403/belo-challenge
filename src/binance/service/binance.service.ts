import { Injectable, Logger } from '@nestjs/common';
import { Spot } from '@binance/connector';

@Injectable()
export class BinanceService {
  private readonly logger = new Logger(BinanceService.name);
  private client: Spot;

  constructor() {
    this.client = new Spot(process.env.BINANCE_API_KEY, process.env.BINANCE_API_SECRET);
  }

  async getAccountInfo() {
    try {
      const response = await this.client.account();
      return response.data;
    } catch (error) {
      this.logger.error(`Error getting account info: ${error.message}`);
      throw new Error('Failed to get account information');
    }
  }

  async getOrderBook(pair: string, limit = 5) {
    try {
      const response = await this.client.depth(pair, { limit });
      return response.data;
    } catch (error) {
      this.logger.error(`Error getting order book for ${pair}: ${error.message}`);
      throw new Error(`Failed to get order book for ${pair}`);
    }
  }

  async newOrder(pair: string, side: string, type: string, params: any) {
    try {
      const response = await this.client.newOrder(pair, side, type, params);
      return response.data;
    } catch (error) {
      this.logger.error(`Error placing new order for ${pair}: ${error.message}`);
      throw new Error(`Failed to place new order for ${pair}`);
    }
  }
}