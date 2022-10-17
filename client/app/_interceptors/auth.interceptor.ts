import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { AccountService, AlertService } from '../_services';
import { User } from '../_models';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private account!: User | null;
  constructor(
    private accountService: AccountService,
    private alertService: AlertService
  ) {
    this.accountService.account.subscribe((account) => {
      this.account = account;
    });
  }

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const isApiUrl = request.url.includes('api/');
    const isAuthUrl = request.url.includes('/auth');

    if (isAuthUrl) {
      // auth request does not require token
      return next.handle(request);
    }

    if (this.account && isApiUrl) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${this.account.token}`
        }
      });
    }
    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {
        // console.log(err.error.message);
        // Log user out client side if there are issues with the token
        if (
          err.error.message.includes('The token has been revoked') ||
          err.error.message.includes('invalid signature')
        ) {
          this.accountService.clientLogout();
          this.alertService.error(
            "You've been logged out as your session was invalid",
            {
              autoClose: false,
              keepAfterRouteChange: true
            }
          );
        }
        return throwError(() => err);
      })
    );
  }
}
