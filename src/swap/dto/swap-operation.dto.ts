import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class SwapOperationDto {
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