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
      `${this.backend.api.account}/create`,
      account
    );
  }

  removeAccount(id: string) {
    return this.http.delete<User>(`${this.backend.api.account}/${id}`);
  }
  updateAccount(id: string, account: User) {
    return this.http.put<Product>(`${this.backend.api.account}/${id}`, account);
  }
  public boundedUpdateAccount = this.updateAccount.bind(this);

  addProduct(product: Product) {
    return this.http.post<Product>(
      `${this.backend.api.store}/products`,
      product
    );
  }

  updateProduct(id: string, product: Product) {
    // console.log(`${this.backend.api.store}/products/${id}`, product);
    return this.http.put<Product>(
      `${this.backend.api.store}/products/${id}`,
      product
    );
  }

  verify(id: string) {
    return this.http.put<User>(`${this.backend.api.account}/${id}/verify`, {});
  }

  removeProduct(id: string) {
    return this.http.delete<Product>(
      `${this.backend.api.store}/products/${id}`
    );
  }
  public boundedUpdateProduct = this.updateProduct.bind(this);

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
