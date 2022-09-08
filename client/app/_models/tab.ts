export class Tab {
  public id: string;
  public name: string;
  public active: boolean;
  public pane: any;

  constructor(n: string, c: any) {
    this.id = `tab-${n}`;
    this.active = false;
    this.name = n;
    this.pane = c;
  }
}
