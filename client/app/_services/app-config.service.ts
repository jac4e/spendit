import { Injectable } from '@angular/core';
import { environment } from 'client/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {
  private appConfig: any; // Type this

  constructor() {}

  async loadAppConfig() {
    // use fetch, not HttpClient, to avoid cyclical dependency
    //  i.e. HttpClient needs HttpInjector which needs AuthInterceptor which needs AccountService
    //       which needs the Backend which needs this service
    return fetch(environment.configFile).then((resp) =>
      resp.json().then((config) => {
        this.appConfig = config;
      })
    );
  }

  get apiBaseUrl(): string | undefined {
    return this.appConfig.apiBaseUrl;
  }

  get branding(): any | undefined {
    return this.appConfig.branding;
  }

  get stripePublicKey(): string | undefined {
    return this.appConfig.stripePublicKey;
  }
}
