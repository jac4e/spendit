import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AccountService } from '../_services';
import { User } from '../_models';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private account!: User | null;
  constructor(private accountService: AccountService) {
    this.accountService.account.subscribe((account) => {
      this.account = account;
    });
  }

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const isApiUrl = request.url.includes('/api/');
    const isAuthUrl = request.url.includes('/auth');

    if (isAuthUrl) {
      // if auth url don't include token, it is unnecessary
      return next.handle(request);
    }

    // console.log("intercept");
    if (this.account && isApiUrl) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${this.account.token}`
        }
      });
    }
    return next.handle(request);
  }
}
