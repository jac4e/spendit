// import { Component, OnInit } from '@angular/core';
// import { StoreService } from '../_services';
// import { Product } from '../_models';
// import { Observable, switchMap } from 'rxjs';
// import { AccountService } from '../_services';

// @Component({
//   selector: 'app-store',
//   templateUrl: './store.component.html',
//   styleUrls: ['./store.component.sass']
// })
// export class StoreComponent implements OnInit {
//   public inventory!: Product[];
//   public columns!: { products: Product[] }[];
//   public col!: number;
//   public inventoryObservable: Observable<Product[]>;
//   constructor(private storeService: StoreService) {
//     this.inventoryObservable = this.storeService.getInventory();
//   }

//   ngOnInit(): void {
//     this.refreshLayout();
//   }

//   // create my own masonry cause prebuilt stuff sucks ass
//   // col-6<576px col-4≥576px col-3≥768px col-2≥1200px
//   // 2 3 4 6

//   layout(inv: Product[]) {
//     const inventory = [...inv];
//     const collectionSize = inventory.length;
//     const wall = document.getElementById('wall');
//     const width = wall?.offsetWidth || 0;
//     const prevCol = this.col;
//     if (width >= 1200) {
//       this.col = 6;
//     } else if (width >= 768) {
//       this.col = 4;
//     } else if (width >= 576) {
//       this.col = 3;
//     } else {
//       this.col = 2;
//     }

//     if (prevCol === this.col) {
//       console.log('dont change layout');
//       return;
//     }
//     console.log('change layout');
//     const productPerColumn = Math.floor(collectionSize / this.col);
//     const spareProduct = collectionSize % this.col;
//     this.columns = new Array(this.col);
//     for (let index = 0; index < productPerColumn; index++) {
//       for (let jndex = 0; jndex < this.col; jndex++) {
//         if (this.columns[jndex] === undefined) {
//           this.columns[jndex] = { products: [] };
//         }
//         this.columns[jndex].products.push(inventory.pop() || new Product());
//       }
//     }
//     if (spareProduct) {
//       for (let index = 0; index < spareProduct; index++) {
//         this.columns[index].products.push(inventory.pop() || new Product());
//       }
//     }
//   }

//   refreshLayout() {
//     if (this.inventory === undefined) {
//       this.inventoryObservable.subscribe((inventory: Product[]) => {
//         this.inventory = inventory;
//         this.layout(inventory);
//       });
//     } else {
//       this.layout(this.inventory);
//     }
//   }
//   addToCart(product: Product) {
//     this.storeService.addToCart(product, 1);
//   }
// }

import { Component, OnInit } from '@angular/core';
import { AlertService, StoreService } from '../_services';
import { Product } from '../_models';
import { Observable, switchMap } from 'rxjs';
import { AccountService } from '../_services';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.sass']
})
export class StoreComponent implements OnInit {
  public inventory: Product[];
  public columns: { products: Product[] }[];
  public col: number;
  public inventoryObservable: Observable<Product[]>;
  constructor(
    private storeService: StoreService,
    protected alertService: AlertService
  ) {
    this.inventory = [];
    this.columns = [];
    this.col = 0;
    this.inventoryObservable = this.storeService.getInventory();
    this.inventoryObservable.subscribe({
      next: (inventory: Product[]) => {
        this.inventory = inventory;
        this.layout(inventory);
      },
      error: (resp) => {
        this.alertService.error('Could not get store inventory');
      }
    });
  }

  ngOnInit(): void {
    this.refreshLayout();
  }

  // create my own masonry cause prebuilt stuff sucks ass
  // col-6<576px col-4≥576px col-3≥768px col-2≥1200px
  // 2 3 4 6

  layout(inv: Product[]) {
    console.log('begin');
    console.log(inv);
    const inventory = [...inv];
    const collectionSize = inventory.length;
    console.log(inventory.length);
    const wall = document.getElementById('wall');
    const width = wall?.offsetWidth || 0;
    console.log(this.col);
    if (width >= 1200) {
      this.col = 6;
    } else if (width >= 768) {
      this.col = 4;
    } else if (width >= 576) {
      this.col = 3;
    } else {
      this.col = 2;
    }

    console.log(this.col);
    console.log('change layout');
    const productPerColumn = Math.floor(collectionSize / this.col);
    const spareProduct = collectionSize % this.col;
    console.log(productPerColumn, spareProduct);
    this.columns = new Array(this.col);
    for (let index = 0; index < productPerColumn; index++) {
      for (let jndex = 0; jndex < this.col; jndex++) {
        console.log(this.columns[jndex]);
        if (this.columns[jndex] === undefined) {
          this.columns[jndex] = { products: [] };
        }
        this.columns[jndex].products.push(inventory.pop() || new Product());
      }
    }
    if (spareProduct) {
      for (let index = 0; index < spareProduct; index++) {
        console.log('Spare product');
        console.log(this.columns[index]);
        if (this.columns[index] === undefined) {
          this.columns[index] = { products: [] };
        }
        this.columns[index].products.push(inventory.pop() || new Product());
        console.log(this.columns[index]);
      }
    }
    console.log(this.columns);
  }

  refreshLayout() {
    if (this.inventory.length === 0) {
      this.inventoryObservable.subscribe({
        next: (inventory: Product[]) => {
          this.inventory = inventory;
          this.layout(inventory);
        },
        error: (resp) => {
          this.alertService.error('Could not get store inventory');
        }
      });
    } else {
      this.layout(this.inventory);
    }
  }
  addToCart(product: Product) {
    this.storeService.addToCart(product, 1);
  }
}
