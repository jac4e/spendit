import { Injectable } from '@angular/core';
import { AccountService } from '.';
import { User, Product } from '../_models';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  private products: Product[] = [
    {
      id: '0',
      name: 'Chips',
      price: 0.75,
      description: 'zero',
      image: '',
    },
    {
      id: '1',
      name: 'Coffee',
      price: 0.75,
      description: 'one',
      image: '',
    },
    {
      id: '2',
      name: 'Coke',
      price: 0.5,
      description: 'two',
      image: '',
    },
    {
      id: '3',
      name: 'Depression',
      price: 0,
      description: 'three',
      image: '',
    },
    {
      id: '4',
      name: 'Granola Bar',
      price: 1,
      description: 'four',
      image: '',
    },
    {
      id: '5',
      name: 'Test Answers',
      price: 100,
      description: 'five',
      image: '',
    },
    {
      id: '6',
      name: 'Kirby',
      price: 10,
      description: 'six',
      image: '',
    },
  ]
  private cart: BehaviorSubject<Product[]> = new BehaviorSubject<Product[]>([]);
  private user!: User;
  isLoggedIn!: boolean;
  credits!: number;
  constructor(
    private accountService: AccountService,
  ) {
    this.accountService.isLoggedIn().subscribe((isLoggedIn: boolean) => {
      this.isLoggedIn = isLoggedIn;
    })
    this.accountService.getCredits().subscribe((credits: number) => {
      this.credits = credits;
    })
  }

  addToCart(product: Product, amt: number){
    if(!product) {
      return 1;
    }
    if(amt <= 0){
      return 1;
    }
    if (!this.isLoggedIn){
      return;
    }

    const currentCart = this.cart.value;
    const updatedCart = [...currentCart, product];

    this.cart.next(updatedCart)

    return 0;
  }

  removeFromCart(product: Product, amt: number){

  }

  getProducts(){
    return this.products;
  }

  getCart(){
    return this.cart.asObservable();
  }

  purchaseCart(){
    if (!this.isLoggedIn){
      return;
    }
    const total = this.getCartTotal();
    
    if (total > this.credits){
      return;
    }

    this.accountService.removeCredits(total);
    this.clearCart();
  }

  getCartTotal(){
    if (this.cart.value.length === 0){
      return 0;
    }
    var sum = 0;
    this.cart.value.forEach(item => {
      sum+= +item.price;
    });

    return sum;
  }
  
  clearCart() {
    const updatedCart: Product[] = [];
    this.cart.next(updatedCart);
  }
}
