import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.sass']
})
export class DashboardComponent implements OnInit {
  links = [
    { title: 'Accounts', route: '/dashboard/accounts' },
    { title: 'Inventory', route: '/dashboard/inventory' },
    { title: 'Transactions', route: '/dashboard/transactions' }
  ];
  url: string;

  constructor(private router: Router, private location: Location) {
    this.url = this.router.url;
    console.log(this.location.path());
    if (this.router.url === '/dashboard'){
      this.router.navigate([this.links[0].route]);
    }
  }

  ngOnInit(): void {
    this.url = this.router.url;
    console.log(this.location.path());
    if (this.router.url === '/dashboard'){
      this.router.navigate([this.links[0].route]);
    }
  }
}
