import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, retry } from 'rxjs/operators';
import { Backend } from '../_helpers';
import { ITransaction } from 'typeit';
import { IAccount, IAccountForm, ICredentials } from 'typeit';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private accountSubject!: BehaviorSubject<IAccount | null>;
  public account!: Observable<IAccount | null>;
  private backend = new Backend();

  constructor(private router: Router, private http: HttpClient) {
    // should just store token in storage and getSelf on construct
    const storageAcc = localStorage.getItem('account');
    const storageToken = localStorage.getItem('token');

    this.accountSubject = new BehaviorSubject<IAccount | null>(
      storageAcc ? JSON.parse(storageAcc) : null
    );

    // console.log(this.accountSubject.value);
    this.account = this.accountSubject.asObservable();
  }

  api(crumb: string) {
    return `${this.backend.api.account}/${crumb}`;
  }

  register(accountForm: IAccountForm) {
    return this.http.post<IAccountForm>(
      `${this.backend.api.account}/register`,
      accountForm
    );
  }

  login(credentials: ICredentials) {
    // console.log('logging in');
    // console.log(this.api('auth'));
    return this.http
      .post<{ account: IAccount; token: string }>(this.api('auth'), credentials)
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
    this.http
      .post(this.api('self/resetSession'), {})
      .pipe(retry(1))
      .subscribe({
        next: () => {
          this.clientLogout();
        }
      });
  }
  clientLogout() {
    localStorage.removeItem('account');
    localStorage.removeItem('token');
    // call reset session on api
    this.accountSubject.next(null);
    this.router.navigate(['/']);
  }

  getAccount() {
    return this.http.get<IAccount>(this.api('self')).pipe(retry(1));
  }

  getBalance() {
    return this.http.get<string>(this.api('self/balance')).pipe(retry(1));
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
    return this.http
      .get<ITransaction[]>(this.api('self/transactions'))
      .pipe(retry(1));
  }
}
