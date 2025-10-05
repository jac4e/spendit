// This backend port MUST be the public facing backend port, not internal port
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfigService } from './app-config.service';
import { Observable } from 'rxjs';
import { HTTP } from 'typesit/lib/common';

@Injectable({
  providedIn: 'root'
})
export class BackendService {
  url: string;
  api: {
    status: string;
    store: string;
    admin: string;
    account: string;
    log: string;
    refill: string;
  };
  constructor(
    private appConfigService: AppConfigService,
    private http: HttpClient
  ) {
    this.http = http;
    this.url = appConfigService.apiBaseUrl ?? '';
    this.api = {
      status: this.url + '/status',
      store: this.url + '/store',
      admin: this.url + '/admin',
      account: this.url + '/accounts',
      log: this.url + '/log',
      refill: this.url + '/refills'
    };
  }

  apiCall<ResType>(method: string, api: string, func?: string): Observable<HTTP<ResType>>;
  apiCall<ResType, ReqType>(method: string, api: string, func?: string, data?: HTTP<ReqType>): Observable<HTTP<ResType>>;
  apiCall<ResType, ReqType = any>(method: string, api: string, func?: string, data?: HTTP<ReqType>): Observable<HTTP<ResType>> {
    const crumb = func === undefined ? '' : `/${func}`;
    switch (method.toUpperCase()) {
      case 'POST':
        return this.http.post<HTTP<ResType>>(`${api}${crumb}`, data);
      case 'GET':
        return this.http.get<HTTP<ResType>>(`${api}${crumb}`);
      case 'PUT':
        return this.http.put<HTTP<ResType>>(`${api}${crumb}`, data);
      case 'DELETE':
        return this.http.delete<HTTP<ResType>>(`${api}${crumb}`);
      default:
        throw 'invalid http method';
    }
  }
}
