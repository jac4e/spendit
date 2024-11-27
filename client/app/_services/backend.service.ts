// This backend port MUST be the public facing backend port, not internal port
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfigService } from './app-config.service';

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

  apiCall<Type>(method: string, api: string, func?: string, data?: any) {
    const crumb = func === undefined ? '' : `/${func}`;
    switch (method.toUpperCase()) {
      case 'POST':
        return this.http.post<Type>(`${api}${crumb}`, data);
      case 'GET':
        return this.http.get<Type>(`${api}${crumb}`);
      case 'PUT':
        return this.http.put<Type>(`${api}${crumb}`, data);
      case 'DELETE':
        return this.http.delete<Type>(`${api}${crumb}`);
      default:
        throw 'invalid http method';
    }
  }
}
