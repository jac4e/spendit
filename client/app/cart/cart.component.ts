import { Component, OnInit } from '@angular/core';
import { first, Observable } from 'rxjs';
import { AccountService, StoreService } from '../_services';
import { ICartItem } from 'typesit';
import { AccountComponent } from '../account/account.component';
import { AlertService } from '../_services/';
import { ListControl, ListControlType } from '../_models';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.sass']
})
export class CartComponent implements OnInit {
  public cart!: Observable<ICartItem[]>;
  public imagePlaceholder = 'https://via.placeholder.com/150';
  loading = false;
  listControl: ListControl[] = [
    {
      name: 'View',
      type: ListControlType.View,
      shouldDisplay: (data: ICartItem) => {
        return true;
      }
    },
    {
      name: 'Edit',
      type: ListControlType.Edit,
      shouldDisplay: (data: ICartItem) => {
        return true;
      },
      edit: {
        successAlert: 'dashboard-alert',
        submit: (id: string, content: any) => {
          return new Observable;
        }
      }
    },
    {
      name: 'Remove',
      type: ListControlType.CustomButton,
      shouldDisplay: (data: ICartItem) => {
        return true;
      },
      onClick: (data: ICartItem) => {
        // this.remove(data.id);
      }
    }
  ];
  constructor(
    private storeService: StoreService,
    private accountService: AccountService,
    protected alertService: AlertService
  ) {
    this.cart = storeService.getCart();
  }

  refreshList() {
    return this.storeService.getInventory()
  }

  ngOnInit(): void {}

  total() {
    return this.storeService.getCartTotal();
  }

  removeItem(index: number) {
    console.log(`removine ${index}`);
    this.storeService.removeFromCart(index);
  }
  decrementItem(index: number) {
    console.log(`decrementing ${index}`);
    this.storeService.decrementFromCart(index);
  }

  incrementItem(index: number) {
    console.log(`incrementing ${index}`);
    this.storeService.incrementToCart(index);
  }

  calculateTotal(product: ICartItem) {
    return BigInt(product.price) * (BigInt(product.amount) || 0n);
  }

  isMoreThanOne(product: ICartItem) {
    return BigInt(product.amount) > 1;
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
        this.alertService.error(resp.error.message, {autoClose: true,id: 'cart-alert'});
        this.loading = false;
        throw resp.error.message;
      }
    });
  }

  clear() {
    this.storeService.clearCart();
  }
}
