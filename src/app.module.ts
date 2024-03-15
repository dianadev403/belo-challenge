import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BinanceModule } from './binance/binance.module';
import { BinanceService } from './binance/service/binance.service';
import { SwapModule } from './swap/swap.module';
import { environments } from './environments/environments';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: environments.database.host,
      port: 5432,
      username: environments.database.username,
      password: environments.database.password,
      database: environments.database.name,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    BinanceModule,
    SwapModule,
  ],
  providers: [BinanceService],
})
export class AppModule {}
