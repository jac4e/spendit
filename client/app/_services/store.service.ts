import { Injectable } from '@angular/core';
import { AccountService } from './account.service';
import { User, Product } from '../_models';
import { BehaviorSubject, retry, catchError } from 'rxjs';
import { Backend } from '../_helpers';
import { HttpClient } from '@angular/common/http';
import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  private backend = new Backend();
  private cart: BehaviorSubject<Product[]> = new BehaviorSubject<Product[]>([]);
  private account!: User | null;
  isLoggedIn!: boolean;
  constructor(
    private accountService: AccountService,
    private http: HttpClient,
    private alertService: AlertService
  ) {
    this.accountService.account.subscribe((account: User | null) => {
      this.account = account;
    });
    const storage = localStorage.getItem('cart');
    this.cart = new BehaviorSubject<Product[]>(
      storage ? JSON.parse(storage) : []
    );
  }

  api(crumb: string) {
    return `${this.backend.api.store}/${crumb}`;
  }

  addToCart(product: Product, amount: number) {
    if (!product) {
      return 1;
    }
    if (amount <= 0) {
      return 1;
    }
    if (!this.account) {
      return;
    }

    const currentCart = this.cart.value;

    const index = currentCart.findIndex((item) => item.id === product.id);

    if (index !== -1) {
      currentCart[index].amount = (currentCart[index].amount || 0) + 1;
    }

    const updatedCart =
      index !== -1
        ? [...currentCart]
        : [...currentCart, { ...product, amount: amount }];
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    this.cart.next(updatedCart);

    return 0;
  }

  removeFromCart(index: number) {
    // console.log(index);
    const updatedCart = this.cart.value;
    // console.log(updatedCart);
    updatedCart.splice(index, 1);
    // console.log(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    this.cart.next(updatedCart);
  }

  decrementFromCart(index: number) {
    // console.log(index);
    const updatedCart = this.cart.value;
    // console.log(updatedCart);
    if ((updatedCart[index].amount || 0) > 1) {
      updatedCart[index].amount = (updatedCart[index].amount || 1) - 1;
    } else {
      this.removeFromCart(index);
    }
    // console.log(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    this.cart.next(updatedCart);
  }

  getInventory() {
    return this.http.get<Product[]>(this.api('products')).pipe(retry(1));
  }

  getCart() {
    return this.cart.asObservable();
  }

  serializeCart(cart: Product[]) {
    return cart.map((cart: Product) => {
      return { id: cart.id, amount: cart.amount };
    });
  }

  purchaseCart() {
    // if (!this.account) {
    //   this.alertService.warn('You must have an account to make purchases.');
    //   return;
    // }
    // console.log(this.serializeCart(this.cart.value));
    // console.log('purchasing');
    // console.log(`${this.backend.api.store}/purchase`);
    return this.http.post<Product[]>(this.api('purchase'), {
      cart: this.serializeCart(this.cart.value)
    });
  }

  getCartTotal() {
    if (this.cart.value.length === 0) {
      return 0;
    }
    let sum = 0;
    this.cart.value.forEach((item) => {
      sum += (item.amount || 0) * item.price;
    });

    return sum;
  }

  getCartLength() {
    return this.cart.value.length;
  }

  clearCart() {
    const updatedCart: Product[] = [];
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    this.cart.next(updatedCart);
  }
}
