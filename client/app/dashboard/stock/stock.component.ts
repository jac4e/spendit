import { Component, OnInit, ViewChild } from '@angular/core';
import { IStockEntry, IStockEntryForm, IProduct, StockEntryType, ProductTypes } from 'typesit';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { AdminService, AlertService } from 'client/app/_services';
import { first, Observable } from 'rxjs';
import { ListControl, ListControlType, SortEvent } from 'client/app/_models';
import { ListComponent } from 'client/app/app-common/list/list.component';

@Component({
  selector: 'app-dashboard-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.sass']
})
export class StockComponent implements OnInit {
  @ViewChild(ListComponent)
  private listComponent!: ListComponent;
  stockEntries!: IStockEntry[];
  form!: UntypedFormGroup;
  entryTypes = Object.values(StockEntryType);
  products: IProduct[] = [];
  loading = false;
  submitted = false;

  refreshStockEntries: Observable<IStockEntry[]>;

  // page stuff
  page = 1;
  pageSize = 10;
  collectionSize = 0;

  listDefaultSort: SortEvent = { column: 'createdAt', direction: 'desc' };
  
  listControl: ListControl[] = [
    {
      name: 'View',
      type: ListControlType.View,
      shouldDisplay: (data: IStockEntry) => {
        return true;
      }
    }
  ];

  constructor(
    private formBuilder: UntypedFormBuilder,
    private adminService: AdminService,
    private alertService: AlertService
  ) {
    this.refreshStockEntries = this.adminService.getAllStockEntries();
    // Load products for the dropdown
    this.adminService.getInventory().subscribe((products) => {
      // Filter to only stock-type products
      this.products = products.filter(p => p.type === ProductTypes.Stock);
    });
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      productId: ['', Validators.required],
      entryType: [
        '',
        [Validators.required, Validators.pattern(`^(${this.entryTypes.join('|')})$`)]
      ],
      delta: [
        null,
        [Validators.required, Validators.pattern('^-?[0-9]*$')]
      ],
      cost: [
        null,
        [Validators.pattern('^[0-9]*$')]
      ]
    });
  }

  get f() {
    return this.form.controls;
  }

  // Check if cost field should be required (only for purchase type)
  get isCostRequired(): boolean {
    return this.form.value.entryType === StockEntryType.Purchase;
  }

  onSubmit() {
    this.submitted = true;

    // Validate cost is required for purchase type
    if (this.isCostRequired && !this.form.value.cost) {
      return;
    }

    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }

    // Confirmation dialog
    if (!confirm('Are you sure you want to add this stock entry?')) {
      return; 
    }

    // Convert to IStockEntryForm
    const stockEntryForm: IStockEntryForm = {
      productId: this.form.value.productId,
      entryType: this.form.value.entryType,
      delta: BigInt(this.form.value.delta),
      cost: this.form.value.cost ? BigInt(this.form.value.cost) : undefined
    };

    this.loading = true;
    this.adminService
      .addStockEntry(stockEntryForm)
      .pipe(first())
      .subscribe({
        next: () => {
          this.alertService.success('Successfully added new stock entry', {
            autoClose: true,
            id: 'dashboard-alert'
          });
          this.loading = false;
          // refresh stock entry list
          this.listComponent.refreshData();
        },
        error: (resp) => {
          this.alertService.error(resp.error.message, {autoClose: true, id: 'dashboard-alert'});
          this.loading = false;
        }
      });
  }
}
