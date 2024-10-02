import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BackendService } from '../_services';
import { IAccount, ITransaction, IAccountForm, ICredentials } from 'typesit';

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
  }

  register(accountForm: IAccountForm) {
    return this.backend.apiCall<IAccountForm>(
      'POST',
      this.backend.api.account,
      'register',
      accountForm
    );
  }

  login(credentials: ICredentials) {
    // console.log('logging in');
    // console.log(this.api('auth'));
    return this.backend
      .apiCall<{ account: IAccount; token: string }>(
        'POST',
        this.backend.api.account,
        'auth',
        credentials
      )
      .pipe(
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
      .apiCall('GET', this.backend.api.account, 'self/resetSession')
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

  getAccount() {
    return this.backend.apiCall<IAccount>(
      'GET',
      this.backend.api.account,
      'self'
    );
  }

  getBalance() {
    return this.backend.apiCall<string>(
      'GET',
      this.backend.api.account,
      'self/balance'
    );
  }

  updateAccount(type: "accountDetails" | "password", currentPassword: ICredentials["password"], accountForm: IAccountForm) {
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
        account.balance = BigInt(balance);
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

  getTransactions() {
    return this.backend.apiCall<ITransaction[]>(
      'GET',
      this.backend.api.account,
      'self/transactions'
    );
  }
}
