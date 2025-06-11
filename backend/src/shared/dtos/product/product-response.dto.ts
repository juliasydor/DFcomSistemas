export class ProductResponseDto {
  id!: string;
  name!: string;
  description!: string;
  price!: number;
  stock!: number;
  createdAt!: Date;
  updatedAt!: Date;

  constructor(partial: Partial<ProductResponseDto>) {
    Object.assign(this, partial);
  }
}
