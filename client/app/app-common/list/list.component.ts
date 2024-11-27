import { ChangeDetectorRef, Component, Directive, EventEmitter, Input, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { IRefill, ITransaction, IAccount, IProduct, getKeys, isIRefill, UnionKeys, UnionValues, RefillStatus, isITransaction } from 'typesit';
import { Observable } from 'rxjs';
import { CommonService } from 'client/app/_services';
import { AllowableListData, ListControl, SortColumn, SortDirection, SortEvent } from 'client/app/_models';

const rotate: { [key: string]: SortDirection } = { asc: 'desc', desc: '', '': 'asc' };
const compare = (v1: string | number, v2: string | number) => (v1 < v2 ? -1 : v1 > v2 ? 1 : 0);

@Directive({
	selector: 'th[sortable]',
	standalone: true,
	host: {
		'[class.asc]': 'direction === "asc"',
		'[class.desc]': 'direction === "desc"',
		'(click)': 'rotate()',
	},
})
export class NgbdSortableHeader {
	@Input() sortable: SortColumn = '';
	@Input() direction: SortDirection = '';
	@Output() sort = new EventEmitter<SortEvent>();

	rotate() {
		this.direction = rotate[this.direction];
		this.sort.emit({ column: this.sortable, direction: this.direction });
	}
}

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.sass']
})

export class ListComponent {
  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;
  data!: AllowableListData[];
  page = 1;
  pageSize = 5;
  collectionSize!: number;
  sortState: SortEvent = { column: '', direction: '' };
  keys!: UnionKeys<AllowableListData>[];
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
      this.headers = new QueryList<NgbdSortableHeader>();
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

  onSort(event: SortEvent) {
		// resetting other headers
		this.sortState = event;
		this.headers.forEach((header) => {
			if (header.sortable !== event.column) {
				header.direction = '';
			}
		});

		this.refreshData();
	}

  sort(data: AllowableListData[]) {
    if (this.sortState.column === '' || this.sortState.direction === '') {
      return data;
    }

    return data = [...data].sort((a, b) => {
      const aVal = Number(a[this.sortState.column as keyof AllowableListData]) || a[this.sortState.column as keyof AllowableListData];
      const bVal = Number(b[this.sortState.column as keyof AllowableListData]) || b[this.sortState.column as keyof AllowableListData];
      console.log(aVal, bVal);

      const res = compare(aVal, bVal);
      return this.sortState.direction === 'asc' ? res : -res;
    });
  }
  
  paginate(data: AllowableListData[]) {
    return data.map((data) => {
      // Format date
      if (getKeys(data).includes('date')) {
        // We know date is a key in the object
        // @ts-ignore
        data.date  = new Date(data.date);
      }
      return data;
    }).slice(
      (this.page - 1) * this.pageSize,
      (this.page - 1) * this.pageSize + this.pageSize
    );
  }

  refreshData() {
    this.getData.subscribe((data: AllowableListData[]) => {
      this.data = this.paginate(this.sort(data));
      this.collectionSize = data.length;
      this.keys = getKeys(data[0]);
    });
  }

  changePageSize() {
    this.page = 1;
    this.refreshData();
  }
}
