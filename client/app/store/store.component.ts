import { Component, OnInit } from '@angular/core';
import { AlertService, StoreService } from '../_services';
import { IProduct } from 'typeit';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.sass']
})
export class StoreComponent implements OnInit {
  public inventory: IProduct[];
  public columns: { products: IProduct[] }[];
  public col: number;
  public inventoryObservable: Observable<IProduct[]>;
  constructor(
    private storeService: StoreService,
    protected alertService: AlertService
  ) {
    this.inventory = [];
    this.columns = [];
    this.col = 0;
    this.inventoryObservable = this.storeService.getInventory();
    this.inventoryObservable.subscribe({
      next: (inventory: IProduct[]) => {
        this.inventory = inventory;
        this.layout(inventory);
      },
      error: (resp) => {
        this.alertService.error(
          `Could not get store inventory: ${resp.error.message}`, {autoClose: true}
        );
      }
    });
  }

  ngOnInit(): void {
    this.refreshLayout();
  }

  // create my own masonry cause prebuilt stuff sucks ass
  // col-6<576px col-4≥576px col-3≥768px col-2≥1200px
  // 2 3 4 6

  layout(inv: IProduct[]) {
    // console.log('begin');
    // console.log(inv);
    const inventory = [...inv];
    const collectionSize = inventory.length;
    // console.log(inventory.length);
    const wall = document.getElementById('wall');
    const width = wall?.offsetWidth || 0;
    // console.log(this.col);
    if (width >= 1200) {
      this.col = 6;
    } else if (width >= 768) {
      this.col = 4;
    } else if (width >= 576) {
      this.col = 3;
    } else {
      this.col = 2;
    }

    // console.log(this.col);
    // console.log('change layout');
    const productPerColumn = Math.floor(collectionSize / this.col);
    const spareProduct = collectionSize % this.col;
    // console.log(productPerColumn, spareProduct);
    this.columns = new Array(this.col);
    for (let index = 0; index < productPerColumn; index++) {
      for (let jndex = 0; jndex < this.col; jndex++) {
        // console.log(this.columns[jndex]);
        if (this.columns[jndex] === undefined) {
          this.columns[jndex] = { products: [] };
        }
        this.columns[jndex].products.push(inventory.pop() || ({} as IProduct));
      }
    }
    if (spareProduct) {
      for (let index = 0; index < spareProduct; index++) {
        // console.log('Spare product');
        // console.log(this.columns[index]);
        if (this.columns[index] === undefined) {
          this.columns[index] = { products: [] };
        }
        this.columns[index].products.push(inventory.pop() || ({} as IProduct));
        // console.log(this.columns[index]);
      }
    }
    // console.log(this.columns);
  }

  refreshLayout() {
    if (this.inventory.length === 0) {
      this.inventoryObservable.subscribe({
        next: (inventory: IProduct[]) => {
          this.inventory = inventory;
          this.layout(inventory);
        },
        error: (resp) => {
          this.alertService.error('Could not get store inventory', {autoClose: true});
        }
      });
    } else {
      this.layout(this.inventory);
    }
  }
  addToCart(product: IProduct) {
    this.storeService.addToCart(product, 1);
  }

  bint(variable: string | number | bigint | boolean): bigint {
    return BigInt(variable);
  }
}
