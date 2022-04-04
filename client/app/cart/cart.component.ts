import { Component, OnInit } from '@angular/core';
import { first, Observable } from 'rxjs';
import { AccountService, StoreService } from '../_services';
import { Product } from '../_models';
import { AccountComponent } from '../account/account.component';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.sass']
})
export class CartComponent implements OnInit {
  public cart!: Observable<Product[]>;
  public imagePlaceholder = 'https://via.placeholder.com/150';
  loading = false;
  constructor(
    private storeService: StoreService,
    private accountService: AccountService
  ) {
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
    this.loading = true;
    this.storeService.purchaseCart()?.subscribe({
      next: () => {
        this.storeService.clearCart();
        this.accountService.refreshBalance();
        this.loading = false;
      },
      error: error => {
        // this.alertService.error(error);
        this.loading = false;
      }
    });
  }

  clear() {
    this.storeService.clearCart();
  }
}
