import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {
  IProduct,
  IProductForm,
  IAccount,
  IAccountBaseForm,
  ITransaction,
  ITransactionForm,
  Roles,
  IRefill,
  IFinanceStats,
  IInventoryStats,
  ITransactionStats,
  IAccountStats,
  IRefillStats,
  IStoreStats,
  ITaskLean,
  StatsDateRange,
  isIProductForm,
  ProductCategories,
  ProductTypes,
  getKeys
} from 'typesit';
import { BackendService } from '../_services';
import { Observable, retry } from 'rxjs';
import { HTTP } from 'typesit/lib/common';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  // eslint-disable-next-line no-unused-vars
  constructor(private backend: BackendService) {}

  addAccount(accountForm: IAccountBaseForm) {
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

  updateAccount(id: IAccount['id'], account: IAccountBaseForm) {
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
    // Create a reqProduct object that is HTTP<IProductForm>
    const reqProduct: HTTP<IProductForm> = {
      ...product,
      price: product.price.toString(),
      stock: product.stock?.toString(),
      order: product.order
    };


    return this.backend.apiCall(
      'POST',
      this.backend.api.store,
      'products',
      reqProduct
    );
  }

  updateProduct(id: IProduct['id'], product: IProductForm) {
    // console.log(`${this.backend.api.store}/products/${id}`, product);
    return this.backend.apiCall<{}, IProductForm>(
      'PUT',
      this.backend.api.store,
      `products/${id}`,
      {
        ...product,
        price: product.price.toString(),
        stock: product.stock?.toString(),
        order: product.order
      }
    )
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

  getAllRefills() {
    return this.backend.apiCall<IRefill[]>('GET', this.backend.api.refill, '');
  }

  approveRefill(refillid: string) {
    return this.backend.apiCall(
      'PUT',
      this.backend.api.refill,
      `${refillid}/approve`
    );
  }
  
  cancelRefill(refillid: string) {
    return this.backend.apiCall(
      'PUT',
      this.backend.api.refill,
      `${refillid}/cancel`
    );
  }

  failRefill(refillid: string) {
    return this.backend.apiCall(
      'PUT',
      this.backend.api.refill,
      `${refillid}/fail`
    );
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

  // Statistics functions
  getFinanceStats(dateOption: StatsDateRange): Observable<IFinanceStats> {
    return this.backend.apiCall<IFinanceStats>('GET', this.backend.api.admin, `stats/finance/${dateOption}`);
  }

  getInventoryStats(): Observable<IInventoryStats> {
    return this.backend.apiCall<IInventoryStats>(
      'GET',
      this.backend.api.admin,
      'stats/inventory'
    );
  }

  getTransactionStats(): Observable<ITransactionStats> {
    return this.backend.apiCall<ITransactionStats>(
      'GET',
      this.backend.api.admin,
      'stats/transactions'
    );
  }

  getAccountStats(): Observable<IAccountStats> {
    return this.backend.apiCall<IAccountStats>(
      'GET',
      this.backend.api.admin,
      'stats/accounts'
    );
  }

  getRefillStats(): Observable<IRefillStats> {
    return this.backend.apiCall<IRefillStats>(
      'GET',
      this.backend.api.admin,
      'stats/refills'
    );
  }

  getStoreStats(): Observable<IStoreStats> {
    return this.backend.apiCall<IStoreStats>(
      'GET',
      this.backend.api.admin,
      'stats/store'
    );
  }

  // Task functions

  getTasks(): Observable<ITaskLean[]> {
    return this.backend.apiCall<HTTP<ITaskLean>[]>('GET', this.backend.api.admin, 'tasks');
  }

  manageTask(taskId: string, command: string, data: any) {
    return this.backend.apiCall(
      'GET',
      this.backend.api.admin,
      `tasks/${taskId}/${command}`,
      data
    );
  }
}
