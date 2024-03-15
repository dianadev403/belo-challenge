import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Test } from '@nestjs/testing';

import { AppModule } from 'src/app.module';
import { Estimation } from 'src/swap/entities/estimation.entity';
import { Swap } from 'src/swap/entities/swap.entity';
import { BinanceService } from 'src/binance/service/binance.service';
import { SwapService } from 'src/swap/service/swap.service';
import { EstimatePriceDto } from 'src/swap/dto/estimate-price.dto';
import { ExecuteSwapDto } from 'src/swap/dto/execute-swap.dto';

describe('swap service integration test', () => {
  let swapService: SwapService;
  let binanceService: BinanceService;
  let estimationId: number;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
      providers: [
        SwapService,
        BinanceService,
        {
          provide: getRepositoryToken(Estimation),
          useClass: Repository<Estimation>,
        },
        {
          provide: getRepositoryToken(Swap),
          useClass: Repository<Swap>,
        },
      ],
    }).compile();

    swapService = moduleRef.get<SwapService>(SwapService);
    binanceService = moduleRef.get<BinanceService>(BinanceService);
  });

  it('should create an estimation', async () => {
    const estimatePriceDto: EstimatePriceDto = {
      pair: 'ETHUSDT',
      volume: 0.01,
      operation: 'BUY',
    };

    const estimation = await swapService.estimatePrice(estimatePriceDto);
    estimationId = estimation.id;

    expect(estimation).toBeDefined();
  });

  it('should execute a swap', async () => {
    expect(estimationId).toBeDefined();

    const executeSwapDto: ExecuteSwapDto = { estimationId };

    const swap = await swapService.executeSwap(executeSwapDto);
    expect(swap).toBeDefined();
  });
});
