import { Product } from './product';

export class Transaction {
  id!: string;
  date!: Date;
  accountid!: string;
  type!: string;
  reason!: string;
  products!: Product[];
  amount!: number;
}
