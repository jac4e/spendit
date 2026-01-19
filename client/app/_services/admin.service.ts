import { last, map } from 'rxjs/operators';
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
  getKeys,
  IAccountSettingsForm,
  IStockEntry,
  IStockEntryForm
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

  updateAccount(id: IAccount['id'], account: IAccountSettingsForm) {
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
      order: product.order ? {
        supplier: product.order.supplier,
        minimum: product.order.minimum.toString(),
      } : undefined
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
        order: product.order ? {
          supplier: product.order.supplier,
          minimum: product.order.minimum.toString(),
        } : undefined
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

  getAllAccounts(): Observable<IAccount[]> {
    return this.backend.apiCall<HTTP<IAccount>[]>('GET', this.backend.api.account).pipe(
      map((accounts) => {
        return accounts.map((account) => {
          return {
            ...account,
            balance: BigInt(account.balance)
          };
        });
      })
    );
  }

  getAllRefills(): Observable<IRefill[]> {
    return this.backend.apiCall<HTTP<IRefill>[]>('GET', this.backend.api.refill, '').pipe(
      map((refills) => {
        return refills.map((refill) => {
          return {
            ...refill,
            amount: BigInt(refill.amount),
            cost: BigInt(refill.cost),
            createdAt: new Date(refill.createdAt),
            updatedAt: new Date(refill.updatedAt)
          };
        });
      })
    );
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

  getAllTransactions(): Observable<ITransaction[]> {
    // console.log('getting transactions');
    // console.log(this.api('transactions'));
    return this.backend.apiCall<HTTP<ITransaction[]>>(
      'GET',
      this.backend.api.admin,
      'transactions'
    ).pipe(
      map((transactions) => {
        return transactions.map((transaction) => {
          return {
            ...transaction,
            createdAt: new Date(transaction.createdAt),
            updatedAt: new Date(transaction.updatedAt),
            total: BigInt(transaction.total)
          };
        });
      })
    );
  }
  getInventory(): Observable<IProduct[]> {
    // console.log(this.api('products'));
    return this.backend.apiCall<HTTP<IProduct[]>>(
      'GET',
      this.backend.api.admin,
      'products'
    ).pipe(
      map((products) => {
        return products.map((product) => {
          const stock = {
            stock: product.stock ? {
              amount: BigInt(product.stock.amount),
              cost: BigInt(product.stock.cost)
            } : undefined
          }

          const order = {
            order: product.order ? {
              supplier: product.order.supplier,
              minimum: BigInt(product.order.minimum),
              current: BigInt(product.order.current)
            } : undefined
          }

          return {
            name: product.name,
            id: product.id,
            category: product.category,
            description: product.description,
            image: product.image,
            type: product.type,
            price: BigInt(product.price),
            ...(product.type === ProductTypes.Stock ? stock : order)
          };
        });
      })
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
    return this.backend.apiCall<HTTP<ITaskLean[]>>('GET', this.backend.api.admin, 'tasks').pipe(
      map((tasks) => {
        return tasks.map((task) => {
          return {
            stopped: task.stopped,
            name: task.name,
            lastRun: task.lastRun ? new Date(task.lastRun) : null,
            nextRun: task.nextRun ? new Date(task.nextRun) : null,
          };
        });
      }
    ));
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
