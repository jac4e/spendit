import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AccountService } from '../_services';
import { Router, NavigationEnd } from '@angular/router';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.sass']
})
export class NavbarComponent implements OnInit {
  brand = {
    name: 'spendit',
    image: '',
  }
  links = [
    { title: 'Store', route: '', guard: 'none' },
    { title: 'Cart', route: 'cart', guard: 'loggedIn' },
    { title: 'Dashboard', route: 'admin', guard: 'admin' },
    { title: 'Account', route: 'account', guard: 'loggedIn' },
  ];

  public isMenuCollapsed = true;
  isAdmin: boolean;
  isLoggedIn: Observable<boolean>;
  balance: Observable<number>;
  currentRoute!: string;
  constructor(
    private accountService: AccountService,
    private router: Router
  ) {
    this.isAdmin = this.accountService.getRole() === "admin";
    this.isLoggedIn = this.accountService.isLoggedIn();
    this.balance = accountService.getCredits();
  }

  ngOnInit(): void {
  }

  login() {
    this.isAdmin = this.accountService.getRole() === "admin";
    this.accountService.login()
  }

  logout() {
    this.accountService.logout()
    this.router.navigate([''])
  }
}
