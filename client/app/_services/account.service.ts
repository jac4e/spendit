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
  private credits = new BehaviorSubject<number>(10);

  private accountSubject!: BehaviorSubject<User | null>;
  public account!: Observable<User | null>;
  private backend = new Backend();

  constructor(private http: HttpClient) {
    const storage = localStorage.getItem('account');
    this.accountSubject = new BehaviorSubject<User | null>(
      storage ? JSON.parse(storage) : null
    );
    // console.log(this.accountSubject.value);
    this.account = this.accountSubject.asObservable();
  }

  api(crumb: string) {
    return `${this.backend.api.account}/${crumb}`;
  }
  login(ccid: string, password: string) {
    console.log('logging in');
    console.log(`${this.backend.api.account}/auth`);
    return this.http
      .post<User>(`${this.backend.api.account}/auth`, { ccid, password })
      .pipe(
        map((account) => {
          localStorage.setItem('account', JSON.stringify(account));
          this.accountSubject.next(account);
          return account;
        })
      );
  }

  logout() {
    localStorage.removeItem('account');
    this.accountSubject.next(null);
  }

  getRole() {
    return 'admin';
  }

  // Credit related

  addCredits(amount: number) {
    if (amount <= 0) {
      return;
    }
    this.credits.next(this.credits.value + amount);
  }

  removeCredits(amount: number) {
    if (amount <= 0) {
      return;
    }
    this.credits.next(this.credits.value - amount);
  }

  getBalance() {
    return this.credits;
  }

  getTransactions() {
    return this.http
      .get<Transaction[]>(this.api('self/transactions'))
      .pipe(retry(1));
  }
}
