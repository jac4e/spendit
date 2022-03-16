import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { StoreService } from '../_services';
import { Product } from '../_models';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.sass']
})
export class CartComponent implements OnInit {
  public cart!: Observable<Product[]>;
  public imagePlaceholder: string = 'https://via.placeholder.com/150';
  constructor(private storeService: StoreService) {
    this.cart = storeService.getCart();
  }

  ngOnInit(): void {}

  total() {
    return this.storeService.getCartTotal();
  }

  removeItem(index: number) {
    console.log(`removine ${index}`);
    this.storeService.removeFromCart(index);
  }

  buy() {
    this.storeService.purchaseCart();
  }

  clear() {
    this.storeService.clearCart();
  }
}
