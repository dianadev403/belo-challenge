import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class EstimatePriceDto {
  @IsNotEmpty()
  @IsString()
  pair: string;

  @IsNotEmpty()
  @IsNumber()
  volume: number;

  @IsNotEmpty()
  @IsString()
  operation: 'BUY' | 'SELL';
}