import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountComponent } from './account/account.component';
import { StoreComponent } from './store/store.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AuthGuard } from './_helpers';
import { LoginComponent } from './login/login.component';
import { CartComponent } from './cart/cart.component';

const routes: Routes = [
  { path: 'account', component: AccountComponent, canActivate: [AuthGuard], data: {role: 'all'}},
  { path: 'cart', component: CartComponent, canActivate: [AuthGuard], data: {role: 'all'}},
  { path: 'admin', component: AdminDashboardComponent, canActivate: [AuthGuard], data: {role: 'admin'} },
  { path: 'login', component: LoginComponent },
  { path: '', component: StoreComponent },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
