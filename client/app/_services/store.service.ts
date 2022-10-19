import { Injectable } from '@angular/core';
import { AccountService } from './account.service';
import { ICartItem, ICart, ICartSerialized, ICartItemSerialized, IAccount, IProduct } from 'typeit';
import { BehaviorSubject, retry, catchError } from 'rxjs';
import { Backend } from '../_helpers';
import { HttpClient } from '@angular/common/http';
import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  private backend = new Backend();
  private cart: BehaviorSubject<ICartItem[]>;
  private account!: IAccount | null;
  isLoggedIn!: boolean;
  constructor(
    private accountService: AccountService,
    private http: HttpClient,
    private alertService: AlertService
  ) {
    this.accountService.account.subscribe((account: IAccount | null) => {
      this.account = account;
    });
    const storage = localStorage.getItem('cart');
    this.cart = new BehaviorSubject<ICartItem[]>(
      storage ? JSON.parse(storage) : []
    );
  }

  api(crumb: string) {
    return `${this.backend.api.store}/${crumb}`;
  }

  addToCart(product: IProduct, amount: bigint | number) {
    // censure amount is bigint
    amount = BigInt(amount);

    if (!product) {
      return 1;
    }
    if (amount <= 0) {
      return 1;
    }
    if (!this.account) {
      return 1;
    }

    const cart = this.cart.value;

    const index = cart.findIndex((item) => item.id === product.id);

    if (index !== -1) {
      cart[index].amount = BigInt(cart[index].amount) + 1n;
    } else {
      const cartItem = {
        ...product,
        amount: amount,
        total: BigInt(product.price) * amount
      } as ICartItem;
      cart.push(cartItem);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    this.cart.next(cart);

    return 0;
  }

  removeFromCart(index: number) {
    // console.log(index);
    const cart = this.cart.value;
    // console.log(cart);
    cart.splice(index, 1);
    // console.log(cart);
    localStorage.setItem('cart', JSON.stringify(cart));
    this.cart.next(cart);
  }

  decrementFromCart(index: number) {
    // console.log(index);
    const cart = this.cart.value;
    // console.log(cart);
    if (cart[index].amount > 1n) {
      cart[index].amount = BigInt(cart[index].amount) - 1n;
    } else {
      this.removeFromCart(index);
    }
    // console.log(cart);
    localStorage.setItem('cart', JSON.stringify(cart));
    this.cart.next(cart);
  }

  getInventory() {
    return this.http.get<IProduct[]>(this.api('products')).pipe(retry(1));
  }

  getCart() {
    return this.cart.asObservable();
  }

  serializeCart(cart: ICart): ICartSerialized {
    return cart.map((cart: ICartItem) => {
      return { id: cart.id, amount: cart.amount.toString() };
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
    return this.http.post(
      this.api('purchase'),
      this.serializeCart(this.cart.value)
    );
  }

  getCartTotal(): bigint {
    if (this.cart.value.length === 0) {
      return 0n;
    }
    let sum = 0n;
    this.cart.value.forEach((item) => {
      sum += BigInt(item.amount) * BigInt(item.price);
    });

    return sum;
  }

  getCartLength() {
    return this.cart.value.length;
  }

  clearCart() {
    localStorage.setItem('cart', JSON.stringify([]));
    this.cart.next([]);
  }
}
