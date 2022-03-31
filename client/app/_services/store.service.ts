import { Injectable } from '@angular/core';
import { AccountService } from './account.service';
import { User, Product } from '../_models';
import { BehaviorSubject, retry } from 'rxjs';
import { Backend } from '../_helpers';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  private backend = new Backend();
  private products: Product[] = [
    {
      id: '0',
      name: 'Chips',
      price: 0.75,
      stock: 0,
      description: 'zero',
      image: ''
    },
    {
      id: '1',
      name: 'Coffee',
      price: 0.75,
      stock: 0,
      description: 'one',
      image: ''
    },
    {
      id: '2',
      name: 'Coke',
      price: 0.5,
      stock: 0,
      description: 'two',
      image: ''
    },
    {
      id: '3',
      name: 'Depression',
      price: 0,
      stock: 0,
      description: 'three',
      image: ''
    },
    {
      id: '4',
      name: 'Granola Bar',
      price: 1,
      stock: 0,
      description: 'four',
      image: ''
    },
    {
      id: '5',
      name: 'Test Answers',
      price: 100,
      stock: 0,
      description: 'five',
      image: ''
    },
    {
      id: '6',
      name: 'Kirby',
      price: 10,
      stock: 0,
      description: 'six',
      image: ''
    }
  ];
  private cart: BehaviorSubject<Product[]> = new BehaviorSubject<Product[]>([]);
  private account!: User | null;
  isLoggedIn!: boolean;
  credits!: number;
  constructor(
    private accountService: AccountService,
    private http: HttpClient
  ) {
    this.accountService.account.subscribe((account: User | null) => {
      this.account = account;
    });
  }

  addToCart(product: Product, amt: number) {
    if (!product) {
      return 1;
    }
    if (amt <= 0) {
      return 1;
    }
    if (!this.account) {
      return;
    }

    const currentCart = this.cart.value;
    const updatedCart = [...currentCart, product];

    this.cart.next(updatedCart);

    return 0;
  }

  removeFromCart(index: number) {
    console.log(index);
    let newCart = this.cart.value;
    console.log(newCart);
    newCart.splice(index, 1);
    console.log(newCart);
    this.cart.next(newCart);
  }

  getInventory() {
    return this.http
      .get<Product[]>(`${this.backend.api.store}/products`)
      .pipe(retry(1));
  }

  getCart() {
    return this.cart.asObservable();
  }

  purchaseCart() {
    if (!this.account) {
      return;
    }
    const total = this.getCartTotal();
    console.log(this.account.balance);
    console.log(total);
    if (this.account.balance === undefined || this.account.balance < total) {
      return;
    }

    this.accountService.removeCredits(total);
    this.accountService.updateCredits();
    this.clearCart();
  }

  getCartTotal() {
    if (this.cart.value.length === 0) {
      return 0;
    }
    let sum = 0;
    this.cart.value.forEach((item) => {
      sum += +item.price;
    });

    return sum;
  }

  clearCart() {
    const updatedCart: Product[] = [];
    this.cart.next(updatedCart);
  }
}
