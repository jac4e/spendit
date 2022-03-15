import { Component, OnInit } from '@angular/core';
import { StoreService } from '../_services';
import { Product } from '../_models';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.sass']
})
export class StoreComponent implements OnInit {
  public products!: Product[];
  public imagePlaceholder: string = "https://via.placeholder.com/150";
  constructor(
    private storeService: StoreService,
  ) { 
    this.products = storeService.getProducts();
  }

  ngOnInit(): void {
  }

  addToCart(product: Product){
    this.storeService.addToCart(product,1);
  }

}