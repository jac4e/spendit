export class Backend {
  url = 'http://localhost:3000/api';
  api = {
    status: this.url + '/status',
    store: this.url + '/store',
    admin: this.url + '/admin',
    account: this.url + '/accounts',
    log: this.url + '/log'
  };
}
