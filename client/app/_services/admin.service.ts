import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IProduct, IProductForm, ITransaction, ITransactionForm } from 'typeit';
import { Backend } from '../_helpers';
import { retry } from 'rxjs';
import { IAccount, IAccountForm } from 'typeit';

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

  addAccount(accountForm: IAccountForm) {
    return this.http.post(`${this.backend.api.account}/create`, accountForm);
  }

  removeAccount(id: IAccount['id']) {
    return this.http.delete(`${this.backend.api.account}/${id}`);
  }

  updateAccount(account: IAccount) {
    return this.http.put(`${this.backend.api.account}/${account.id}`, account);
  }
  public boundedUpdateAccount = this.updateAccount.bind(this);

  addProduct(product: IProductForm) {
    return this.http.post(`${this.backend.api.store}/products`, product);
  }

  updateProduct(id: IProduct['id'], product: IProductForm) {
    // console.log(`${this.backend.api.store}/products/${id}`, product);
    return this.http.put(`${this.backend.api.store}/products/${id}`, product);
  }

  verify(id: IAccount['id']) {
    return this.http.put(`${this.backend.api.account}/${id}/verify`, {});
  }

  removeProduct(id: string) {
    return this.http.delete(`${this.backend.api.store}/products/${id}`);
  }
  public boundedUpdateProduct = this.updateProduct.bind(this);

  addTransaction(transaction: ITransactionForm) {
    return this.http.post(this.api('transactions'), transaction);
  }

  getAllAccounts() {
    return this.http
      .get<IAccount[]>(`${this.backend.api.account}`)
      .pipe(retry(1));
  }

  getAllTransactions() {
    // console.log('getting transactions');
    // console.log(this.api('transactions'));
    return this.http
      .get<ITransaction[]>(this.api('transactions'))
      .pipe(retry(1));
  }
  getInventory() {
    // console.log(this.api('products'));
    return this.http.get<IProduct[]>(this.api('products')).pipe(retry(1));
  }
}
