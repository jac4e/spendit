import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BackendService } from '../_services';
import { IAccount, ITransaction, IAccountBaseForm, IAccountSettingsForm, IAccountPasswordForm, ICredentials, RefillMethods, IRefill } from 'typesit';
import { HTTP, ICoin } from 'typesit/lib/common';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  public accountSubject!: BehaviorSubject<IAccount | null>;
  public account!: Observable<IAccount | null>;

  constructor(private router: Router, private backend: BackendService) {
    // should just store token in storage and getSelf on construct
    const storageAcc = localStorage.getItem('account');
    const storageToken = localStorage.getItem('token');

    this.accountSubject = new BehaviorSubject<IAccount | null>(
      storageAcc ? JSON.parse(storageAcc) : null
    );

    // console.log(this.accountSubject.value);
    this.account = this.accountSubject.asObservable();

    // upodate account every 30 seconds
    setInterval(() => {
      if (this.accountSubject.value !== null) {
        this.refreshAccount();
      }
    }, 30000);
  }

  register(accountForm: IAccountBaseForm) {
    return this.backend.apiCall<{}, IAccountBaseForm>(
      'POST',
      this.backend.api.account,
      'register',
      accountForm
    );
  }

  login(credentials: ICredentials): Observable<IAccount> {
    // console.log('logging in');
    // console.log(this.api('auth'));
    return this.backend
      .apiCall<{ account: IAccount; token: string }, ICredentials>(
        'POST',
        this.backend.api.account,
        'auth',
        credentials as HTTP<ICredentials>
      )
      .pipe(
        map(({ account, token }) => {
          return {
            account: {
              ...account,
              balance: BigInt(account.balance)
            },
            token: token
          }
        }),
        map(({ account, token }) => {
          localStorage.setItem('account', JSON.stringify(account));
          localStorage.setItem('token', token);
          this.accountSubject.next(account);
          return account;
        })
      );
  }

  logout() {
    // call reset session on api
    // logs out all instances of account session
    this.backend
      .apiCall<{}>('GET', this.backend.api.account, 'self/resetSession')
      .subscribe({
        next: () => {
          this.resetClientAccount();
        }
      });
  }
  resetClientAccount() {
    localStorage.removeItem(this.backend.api.account);
    localStorage.removeItem('token');
    // call reset session on api
    this.accountSubject.next(null);
    this.router.navigate(['/']);
  }

  getAccount(): Observable<IAccount> {
    return this.backend.apiCall<IAccount>(
      'GET',
      this.backend.api.account,
      'self'
    ).pipe(
      map((account) => {
        return {
          ...account,
          balance: BigInt(account.balance)
        };
      })
    );
  }

  getBalance(): Observable<ICoin> {
    return this.backend.apiCall<HTTP<ICoin>>(
      'GET',
      this.backend.api.account,
      'self/balance'
    ).pipe(
      map((balance) => {
        return BigInt(balance);
      })
    );
  }

  updateAccount(type: "settings" | "password", currentPassword: ICredentials["password"], accountForm: IAccountSettingsForm | IAccountPasswordForm) {
    return this.backend.apiCall(
      'PUT',
      this.backend.api.account,
      'self',
      {type: type, currentPassword: currentPassword, accountForm: accountForm}
    );
  }

  refreshBalance() {
    this.getBalance().subscribe({
      next: (balance) => {
        // console.log(balance);
        if (this.accountSubject.value === null) {
          throw 'Cannot update balance on null account';
        }
        const account = this.accountSubject.value;
        account.balance = balance;
        localStorage.setItem('account', JSON.stringify(account));
        this.accountSubject.next(account);
      }
    });
  }

  refreshAccount() {
    this.getAccount().subscribe({
      next: (account: IAccount) => {
        localStorage.setItem('account', JSON.stringify(account));
        this.accountSubject.next(account);
      }
    });
  }

  getTransactions(): Observable<ITransaction[]> {
    return this.backend.apiCall<HTTP<ITransaction>[]>(
      'GET',
      this.backend.api.account,
      'self/transactions'
    ).pipe(
      map((transactions) => {
        return transactions.map((transaction) => {
          return {
            ...transaction,
            total: BigInt(transaction.total)
          };
        });
      })
    );
  }

  requestRefill(method: RefillMethods, amount: string): Observable<IRefill> {
    return this.backend.apiCall<IRefill, { method: RefillMethods; amount: string }>(
      'POST',
      this.backend.api.account,
      'self/refill',
      { method, amount }
    ).pipe(
      map((refill) => {
        return {
          ...refill,
          amount: BigInt(refill.amount),
          cost: BigInt(refill.cost),
          dateCreated: new Date(refill.dateCreated),
          dateUpdated: new Date(refill.dateUpdated)
        };
      })
    );
  }

  cancelRefill(refillId: string) {
    return this.backend.apiCall<{}>(
      'DELETE',
      this.backend.api.account,
      `self/refill/${refillId}`
    );
  }

  getRefillHistory(): Observable<IRefill[]> {
    return this.backend.apiCall<IRefill[]>(
      'GET',
      this.backend.api.account,
      'self/refill'
    ).pipe(
      map((refills) => {
        return refills.map((refill) => {
          return {
            ...refill,
            amount: BigInt(refill.amount),
            cost: BigInt(refill.cost),
            dateCreated: new Date(refill.dateCreated),
            dateUpdated: new Date(refill.dateUpdated)
          };
        });
      })
    );
  }

}
