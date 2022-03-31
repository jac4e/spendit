import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.sass']
})
export class DashboardComponent implements OnInit {
  links = [
    { title: 'Accounts', route: 'accounts' },
    { title: 'Inventory', route: 'inventory' },
    { title: 'Transactions', route: 'transactions' }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.navigate(['/dashboard/accounts']);
  }
}
