import { config } from 'dotenv';

config();

const env = process.env;

export const environments ={
  port: env.PORT,
  database: {
    host: env.DATABASE_HOST,
    port: env.DATABASE_PORT,
    username: env.DATABASE_USERNAME,
    password: env.DATABASE_PASSWORD,
    name: env.DATABASE_NAME,
  },
  binance: {
    apiKey: env.BINANCE_API_KEY,
    apiSecret: env.BINANCE_SECRET_KEY,
  },
  binanceFee: parseFloat(env.BINANCE_FEE_PERCENTAGE),
  beloFee: parseFloat(env.BELO_FEE_PERCENTAGE)
}