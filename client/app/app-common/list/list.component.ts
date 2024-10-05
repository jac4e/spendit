import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { IRefill, ITransaction, IAccount, IProduct, getKeys, isIRefill, UnionKeys, UnionValues, RefillStatus, isITransaction } from 'typesit';
import { Observable } from 'rxjs';
import { CommonService } from 'client/app/_services';
import { AllowableListData, ListControl } from 'client/app/_models';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.sass']
})

export class ListComponent {
  data!: AllowableListData[];
  page = 1;
  pageSize = 10;
  collectionSize!: number;
  keys!: string[];
  @Input() getData!: Observable<AllowableListData[]>;
  @Input() name!: string;
  @Input() exclude!: string[] | undefined;
  @Input() controls!: ListControl[] | undefined;
  titleCase: (str: string) => string = this.commonService.titleCase;
  // @Input() refreshList!: () => void;

  constructor(
    private commonService: CommonService,
    private changeDetectorRef: ChangeDetectorRef
    ) {
  }

  ngOnInit(): void {
    this.refreshData();
  }

  export() {
    this.getData.subscribe((data: AllowableListData[]) => {
      this.commonService.export(
        data,
        `${this.name}_${this.commonService.localeISOTime()}.csv`
      );
    });
  }

  getTableValue(data: AllowableListData, key: string): UnionValues<AllowableListData> {
    if (!getKeys(data).includes(key as UnionKeys<AllowableListData>)) {
      throw new Error(`Key ${key} not found in data`);
    }
    const value = data[key as keyof AllowableListData] as UnionValues<AllowableListData>;
    if (value instanceof Date) {
      return value.toLocaleString('en-us',{timeZoneName:'short'});
    } else {
      return value;
    }

  }

  refreshClick(a: any) {
    this.refreshData();
  }

  setRowClass(data: AllowableListData): string {
    if (isIRefill(data)) {
      switch (data.status) {
        case RefillStatus.Pending:
          return 'table-warning';
        case RefillStatus.Failed:
          return 'table-danger';
        case RefillStatus.Cancelled:
          return 'table-secondary';
        case RefillStatus.Complete:
          return 'table-success';
        default:
          return '';
      }
    } else if(isITransaction(data)) {
      return data.type === 'debit' ? 'table-danger' : 'table-success'
    }
    return '';
  }

  refreshData() {
    this.getData.subscribe((data: AllowableListData[]) => {
      this.data = data.map((data) => {
        // Format date
        if (getKeys(data).includes('date')) {
          // We know date is a key in the object
          // @ts-ignore
          data.date  = new Date(data.date);
        }
        return data;
      });
      this.collectionSize = data.length;
      this.data = data.slice(
        (this.page - 1) * this.pageSize,
        (this.page - 1) * this.pageSize + this.pageSize
      );
      this.keys = getKeys(data[0]);
    });
  }
}
