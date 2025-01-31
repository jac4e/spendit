import { Injectable } from '@angular/core';
import {
  IProduct,
  IProductForm,
  IAccount,
  IAccountForm,
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
  StatsDateRange
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
  getFinanceStats(dateOption: StatsDateRange) {
    return this.backend.apiCall<IFinanceStats>('GET', this.backend.api.admin, `stats/finance/${dateOption}`);
  }

  getInventoryStats() {
    return this.backend.apiCall<IInventoryStats>(
      'GET',
      this.backend.api.admin,
      'stats/inventory'
    );
  }

  getTransactionStats() {
    return this.backend.apiCall<ITransactionStats>(
      'GET',
      this.backend.api.admin,
      'stats/transactions'
    );
  }

  getAccountStats() {
    return this.backend.apiCall<IAccountStats>(
      'GET',
      this.backend.api.admin,
      'stats/accounts'
    );
  }

  getRefillStats() {
    return this.backend.apiCall<IRefillStats>(
      'GET',
      this.backend.api.admin,
      'stats/refills'
    );
  }

  getStoreStats() {
    return this.backend.apiCall<IStoreStats>(
      'GET',
      this.backend.api.admin,
      'stats/store'
    );
  }

  // Task functions

  getTasks() {
    return this.backend.apiCall<ITaskLean[]>('GET', this.backend.api.admin, 'tasks');
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
