import { Injectable } from '@nestjs/common';
import { Spot } from '@binance/connector';
import { environments } from 'src/environments/environments';



const apiKey = environments.binance.apiKey;
const apiSecret = environments.binance.apiSecret;

const client = new Spot(apiKey, apiSecret, {
  baseURL: 'https://testnet.binance.vision',
});
@Injectable()
export class BinanceService {
  constructor() {}

  async getAccountInfo() {
    try {
      const response = await client.account();
      return response.data;
    } catch (error) {
      throw new Error('Failed to get account information');
    }
  }

  async getOrderBook(pair: string, limit = 5) {
    try {
      const response = await client.depth(pair, { limit });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get order book for ${pair}`);
    }
  }

  async newOrder(
    pair: string,
    operation: string,
    type: string,
    quantity: number,
    price: string,
  ) {
    try {
      const response = await client.newOrder(pair, operation, type, {
        price,
        quantity,
        timeInForce: 'GTC',
      });
      return response.data;
    } catch (error) {
      console.log(error);
      throw new Error(`Failed to place new order for ${pair}`);
    }
  }
}
