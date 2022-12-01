import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, Observable, retry, throwError, timer } from 'rxjs';
import { IAccount } from 'typesit';
import { AccountService, AlertService } from '../_services';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private account!: IAccount | null;
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
    const token = localStorage.getItem('token');
    const retryConfig = {
      count: 3,
      delay: (error: HttpErrorResponse, retryCount: number) => {
        console.log(request.method);
        // only retry on get attempts
        if (request.method !== 'GET') {
          throw error;
        }

        // Bad Gateway, service unavailable, gateway timeout
        if (
          error.status === 502 ||
          error.status === 503 ||
          error.status === 504
        ) {
          return timer(1000 * retryCount);
        }
        // Request timeout, Rate limit
        if (error.status === 408 || error.status === 429) {
          // need logic here to determine how long it needs to wait before retrying
          return timer(1000 * retryCount);
        }
        throw error;
      }
    };

    if (this.account === null || token === null) {
      // account or token does not exist yet, clean client account info for safety
      this.accountService.resetClientAccount();
    }

    // Add auth header to api requests that are not the auth endpoint if token and account exist
    if (isApiUrl && !isAuthUrl && this.account !== null && token !== null) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(request).pipe(
      retry(retryConfig),
      catchError((err: HttpErrorResponse) => {
        // Remove account and token for any token related error
        if (err.status === 401) {
          this.accountService.resetClientAccount();
          this.alertService.error(
            'Your session has expired, please login again.',
            { autoClose: false, keepAfterRouteChange: true }
          );
        }
        return throwError(() => err);
      })
    );
  }
}
