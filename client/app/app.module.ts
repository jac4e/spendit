import { HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AccountComponent } from './account/account.component';
import { AppCommonModule } from './app-common/app-common.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CartComponent } from './cart/cart.component';
import { LoginComponent } from './login/login.component';
import { NavbarComponent } from './navbar/navbar.component';
import { StoreComponent } from './store/store.component';
import { httpInterceptorProviders } from './_interceptors';
import { NgIconsModule } from '@ng-icons/core';
import {
  dripMinus,
  dripBasket,
  dripCross,
  dripMenu
} from '@ng-icons/dripicons';
import { RegisterComponent } from './register/register.component';
import { AppConfigService } from './_services/app-config.service';

@NgModule({
  declarations: [
    AppComponent,
    StoreComponent,
    AccountComponent,
    NavbarComponent,
    LoginComponent,
    CartComponent,
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    NgIconsModule.withIcons({ dripMinus, dripBasket, dripCross, dripMenu }),
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    NgbModule,
    AppCommonModule
  ],
  providers: [
    httpInterceptorProviders,
    {
      provide: APP_INITIALIZER,
      multi: true,
      deps: [AppConfigService],
      useFactory: (appConfigService: AppConfigService) => () =>
        appConfigService.loadAppConfig()
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
