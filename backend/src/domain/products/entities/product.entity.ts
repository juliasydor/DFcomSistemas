import { v4 as uuidv4 } from 'uuid';

export class Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    name: string,
    description: string,
    price: number,
    stock: number,
    imageUrl?: string,
    id?: string,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    this.id = id || uuidv4();
    this.name = name;
    this.description = description;
    this.price = price;
    this.stock = stock;
    this.imageUrl = imageUrl;
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();

    this.validate();
  }

  private validate(): void {
    if (!this.name || this.name.trim().length === 0) {
      throw new Error('Product name cannot be empty.');
    }
    if (this.price <= 0) {
      throw new Error('Product price must be greater than zero.');
    }
    if (this.stock < 0) {
      throw new Error('Product stock cannot be negative.');
    }
  }

  updateDetails(
    name?: string,
    description?: string,
    price?: number,
    stock?: number,
    imageUrl?: string,
  ): void {
    if (name !== undefined) this.name = name;
    if (description !== undefined) this.description = description;
    if (price !== undefined) this.price = price;
    if (stock !== undefined) this.stock = stock;
    if (imageUrl !== undefined) this.imageUrl = imageUrl;
    this.updatedAt = new Date();
    this.validate();
  }
}
