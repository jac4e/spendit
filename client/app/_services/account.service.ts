import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../_models';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private isLogin = new BehaviorSubject<boolean>(false);
  private credits = new BehaviorSubject<number>(10);
  constructor() {
  }

  login(){
    this.isLogin.next(true);
  }

  logout(){
    this.isLogin.next(false);
  }

  isLoggedIn(){
    return this.isLogin.asObservable();
  }

  getRole(){
    return 'admin';
  }

  // Credit related

  addCredits(amount: number){
    if(amount<=0){
      return;
    }
    this.credits.next( this.credits.value + amount);
  }

  removeCredits(amount:number){
    if(amount<=0){
      return;
    }
    this.credits.next( this.credits.value - amount);
  }

  getCredits(){
    return this.credits;
  }

}
