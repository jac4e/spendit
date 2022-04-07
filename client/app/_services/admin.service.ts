import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User, Product, Transaction } from '../_models';
import { Backend } from '../_helpers';
import { retry } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private backend = new Backend();
  // eslint-disable-next-line no-unused-vars
  constructor(private http: HttpClient) {}

  api(crumb: string) {
    return `${this.backend.api.admin}/${crumb}`;
  }

  addAccount(account: User) {
    return this.http.post<User>(
      `${this.backend.api.account}/register`,
      account
    );
  }

  addProduct(product: Product) {
    return this.http.post<Product>(
      `${this.backend.api.store}/products`,
      product
    );
  }

  addTransaction(transaction: Transaction) {
    return this.http.post<Transaction>(this.api('transactions'), transaction);
  }

  getAllAccounts() {
    return this.http.get<User[]>(`${this.backend.api.account}`).pipe(retry(1));
  }

  getAllTransactions() {
    // console.log('getting transactions');
    // console.log(this.api('transactions'));
    return this.http
      .get<Transaction[]>(this.api('transactions'))
      .pipe(retry(1));
  }
  getInventory() {
    // console.log(this.api('products'));
    return this.http.get<Product[]>(this.api('products')).pipe(retry(1));
  }
}
