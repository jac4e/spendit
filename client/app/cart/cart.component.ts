import { Component, OnInit } from '@angular/core';
import { first, Observable } from 'rxjs';
import { AccountService, StoreService } from '../_services';
import { Product } from '../_models';
import { AccountComponent } from '../account/account.component';
import { AlertService } from '../_services/';

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
    private accountService: AccountService,
    protected alertService: AlertService
  ) {
    this.cart = storeService.getCart();
  }

  ngOnInit(): void {}

  total() {
    return this.storeService.getCartTotal();
  }

  removeItem(index: number) {
    // console.log(`removine ${index}`);
    this.storeService.removeFromCart(index);
  }
  decrementItem(index: number) {
    // console.log(`removine ${index}`);
    this.storeService.decrementFromCart(index);
  }

  buy() {
    // check if cart is empty
    this.loading = true;
    this.storeService.purchaseCart()?.subscribe({
      next: () => {
        this.storeService.clearCart();
        this.accountService.refreshBalance();
        this.alertService.success('Your purchase was successful', {id: 'cart-alert', autoClose: true});
        this.loading = false;
      },
      error: (resp) => {
        // console.log(e);
        this.alertService.error(resp.error.message, {id: 'cart-alert'});
        this.loading = false;
        throw resp.error.message;
      }
    });
  }

  clear() {
    this.storeService.clearCart();
  }
}
