import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { AccountService } from '../_services';
import { IAccount } from 'typeit';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private account!: IAccount | null;
  constructor(private accountService: AccountService) {
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
      // if auth url don't include token, it is unnecessary
      return next.handle(request);
    }

    if (this.account && isApiUrl) {
      const token = localStorage.getItem('token');
      if (token === null) {
        // Some unkown state where the account exists but token doesn't
        this.accountService.clientLogout();
      }
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }
    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {
        // console.log(err);
        const tokenError = [
          'invalid signature',
          'The token has been revoked'
        ].some((substring) => {
          return err.error.message.includes(substring);
        });
        if (tokenError) {
          this.accountService.clientLogout();
        }
        return throwError(() => err);
      })
    );
  }
}
