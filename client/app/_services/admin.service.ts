import { Injectable } from '@angular/core';
import {
  IProduct,
  IProductForm,
  IAccount,
  IAccountForm,
  ITransaction,
  ITransactionForm,
  Roles
} from 'typesit';
import { BackendService } from '../_services';
import { retry } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  // eslint-disable-next-line no-unused-vars
  constructor(private backend: BackendService) {}

  addAccount(accountForm: IAccountForm) {
    return this.backend.apiCall(
      'POST',
      this.backend.api.account,
      'create',
      accountForm
    );
  }

  removeAccount(id: IAccount['id']) {
    return this.backend.apiCall('DELETE', this.backend.api.account, id);
  }

  updateAccount(id: IAccount['id'], account: IAccountForm) {
    return this.backend.apiCall('PUT', this.backend.api.account, id, account);
  }

  resetPassword(id: IAccount['id']) {
    return this.backend.apiCall(
      'PUT',
      this.backend.api.account,
      `${id}/resetPassword`
    );
  }

  public boundedUpdateAccount = this.updateAccount.bind(this);
  public boundedResetPassword = this.resetPassword.bind(this);

  addProduct(product: IProductForm) {
    return this.backend.apiCall(
      'POST',
      this.backend.api.store,
      'products',
      product
    );
  }

  updateProduct(id: IProduct['id'], product: IProductForm) {
    // console.log(`${this.backend.api.store}/products/${id}`, product);
    return this.backend.apiCall(
      'PUT',
      this.backend.api.store,
      `products/${id}`,
      product
    );
  }
  public boundedUpdateProduct = this.updateProduct.bind(this);

  verify(id: IAccount['id'], role: Roles) {
    return this.backend.apiCall(
      'PUT',
      this.backend.api.account,
      `${id}/verify/${role}`,
      {}
    );
  }

  removeProduct(id: string) {
    return this.backend.apiCall(
      'DELETE',
      this.backend.api.store,
      `products/${id}`
    );
  }

  addTransaction(transaction: ITransactionForm) {
    return this.backend.apiCall(
      'POST',
      this.backend.api.admin,
      'transactions',
      transaction
    );
  }

  getAllAccounts() {
    return this.backend.apiCall<IAccount[]>('GET', this.backend.api.account);
  }

  getAllTransactions() {
    // console.log('getting transactions');
    // console.log(this.api('transactions'));
    return this.backend.apiCall<ITransaction[]>(
      'GET',
      this.backend.api.admin,
      'transactions'
    );
  }
  getInventory() {
    // console.log(this.api('products'));
    return this.backend.apiCall<IProduct[]>(
      'GET',
      this.backend.api.admin,
      'products'
    );
  }
}
