import { IsNotEmpty, IsNumber } from 'class-validator';

export class ExecuteSwapDto {
  @IsNotEmpty()
  @IsNumber()
  estimationId: number;
}