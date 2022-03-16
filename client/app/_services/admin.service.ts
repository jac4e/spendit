import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User, Product } from '../_models';
import { Backend } from '../_helpers';
import { retry } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private backend = new Backend();
  // eslint-disable-next-line no-unused-vars
  constructor(private http: HttpClient) {}

  addAccount(account: User) {
    return this.http.post<User>(
      `${this.backend.api.account}/register`,
      account
    );
  }
  addProduct(product: Product) {
    return this.http.post<Product>(
      `${this.backend.api.store}/products`,
      product
    );
  }

  getAllAccounts() {
    return this.http
      .get<User[]>(`${this.backend.api.account}/getAll`)
      .pipe(retry(1));
  }
}
