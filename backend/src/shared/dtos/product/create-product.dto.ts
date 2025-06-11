import { IsString, IsNotEmpty, IsNumber, Min, IsInt } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsNumber()
  @Min(0.01)
  price!: number;

  @IsInt()
  @Min(0)
  stock!: number;
}
