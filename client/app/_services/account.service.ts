import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpResponse
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';
import { Backend } from '../_helpers';
import { User, Transaction } from '../_models';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private accountSubject!: BehaviorSubject<User | null>;
  public account!: Observable<User | null>;
  private backend = new Backend();

  constructor(private http: HttpClient) {
    // should just store token in storage and getSelf on construct
    const storageAcc = localStorage.getItem('account');

    this.accountSubject = new BehaviorSubject<User | null>(
      storageAcc ? JSON.parse(storageAcc) : null
    );

    // console.log(this.accountSubject.value);
    this.account = this.accountSubject.asObservable();
  }

  api(crumb: string) {
    return `${this.backend.api.account}/${crumb}`;
  }

  login(ccid: string, password: string) {
    console.log('logging in');
    console.log(this.api('auth'));
    return this.http.post<User>(this.api('auth'), { ccid, password }).pipe(
      map((account) => {
        localStorage.setItem('account', JSON.stringify(account));
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
          localStorage.removeItem('account');
          // call reset session on api
          this.accountSubject.next(null);
        },
        error: () => {
          // this.alertService.error(error);
        }
      });
  }

  getRole() {
    return 'admin';
  }

  getAccount() {
    return this.http.get<User>(this.api('self')).pipe(retry(1));
  }

  // Credit related

  // addCredits(amount: number) {
  //   if (amount <= 0) {
  //     return;
  //   }
  //   this.credits.next(this.credits.value + amount);
  // }

  // removeCredits(amount: number) {
  //   if (amount <= 0) {
  //     return;
  //   }
  //   this.credits.next(this.credits.value - amount);
  // }

  getBalance() {
    return this.http.get<number>(this.api('self/balance')).pipe(retry(1));
  }
  refreshBalance() {
    this.getBalance().subscribe({
      next: (balance) => {
        console.log(balance);
        const account = this.accountSubject.value || new User();
        account.balance = balance;
        localStorage.setItem('account', JSON.stringify(account));
        this.accountSubject.next(account);
      },
      error: (error) => {
        // this.alertService.error(error);
      }
    });
  }
  refreshAccount() {
    this.getAccount().subscribe({
      next: (account) => {
        account.token = this.accountSubject.value?.token || '';
        localStorage.setItem('account', JSON.stringify(account));
        this.accountSubject.next(account);
      },
      error: (error) => {
        // this.alertService.error(error);
      }
    });
  }

  getTransactions() {
    return this.http
      .get<Transaction[]>(this.api('self/transactions'))
      .pipe(retry(1));
  }
}
