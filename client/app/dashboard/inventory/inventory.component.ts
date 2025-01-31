import { Component, OnInit, ViewChild } from '@angular/core';
import { AdminService } from 'client/app/_services/admin.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs';
import { IProduct } from 'typesit';
import {
  AlertService,
  CommonService,
  StoreService
} from 'client/app/_services';
import { ListControl, ListControlType } from 'client/app/_models';
import { ListComponent } from 'client/app/app-common/list/list.component';

@Component({
  selector: 'app-dashboard-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.sass']
})
export class InventoryComponent implements OnInit {
  @ViewChild(ListComponent)
  private listComponent!: ListComponent;
  inventory!: IProduct[];
  form!: UntypedFormGroup;
  loading = false;
  submitted = false;
  updateProduct;
  listControl: ListControl[] = [
    {
      name: 'View',
      type: ListControlType.View,
      shouldDisplay: (data: IProduct) => {
        return true;
      }
    },
    {
      name: 'Edit',
      type: ListControlType.Edit,
      shouldDisplay: (data: IProduct) => {
        return true;
      },
      edit: {
        successAlert: 'dashboard-alert',
        submit: this.adminService.boundedUpdateProduct,
      }
    },
    {
      name: 'Remove',
      type: ListControlType.CustomButton,
      shouldDisplay: (data: IProduct) => {
        return true;
      },
      onClick: (data: IProduct) => {
        this.remove(data.id);
      }
    }
  ];
  constructor(
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private storeService: StoreService,
    private adminService: AdminService,
    private commonService: CommonService,
    private alertService: AlertService
  ) {
    this.updateProduct = this.adminService.boundedUpdateProduct;
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      price: [
        null,
        [Validators.required, Validators.min(0), Validators.pattern('^[0-9]*$')]
      ],
      stock: [
        0,
        [Validators.required, Validators.min(0), Validators.pattern('^[0-9]*$')]
      ],
      description: [''],
      image: ['']
    });
  }
  get f() {
    return this.form.controls;
  }
  export() {
    this.storeService.getInventory().subscribe((data: IProduct[]) => {
      this.commonService.export(
        data,
        `inventory_${this.commonService.localeISOTime()}.csv`
      );
    });
  }
  remove(id: string) {
    // Pop up a confirmation dialog
    if (!confirm('Are you sure you want to remove this item?')) {
      return;
    }
    // console.log('remove', id);
    this.adminService.removeProduct(id).subscribe({
      next: () => {
        this.listComponent.refreshData();
      },
      error: (resp) => {
        this.alertService.error(resp.error.message);
      }
    });
  }
  refreshList() {
    return this.storeService.getInventory()
  }
  onSubmit() {
    this.submitted = true;

    // reset alerts on submit
    // this.alertService.clear();

    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }

    // Confirmation dialog
    if (!confirm('Are you sure you want to add this inventory item?')) {
      return;
    }

    // convert form to IProductForm
    const productForm = this.form.value;
    productForm.price = BigInt(productForm.price);
    productForm.stock = BigInt(productForm.stock);

    this.loading = true;
    this.adminService
      .addProduct(this.form.value)
      .pipe(first())
      .subscribe({
        next: () => {
          this.alertService.success('Successfully added new inventory item', {
            autoClose: true,
            id: 'dashboard-alert'
          });
          this.loading = false;
          this.listComponent.refreshData();
        },
        error: (resp) => {
          this.alertService.error(resp.error.message, {autoClose: true,id: 'dashboard-alert'});
          this.loading = false;
        }
      });
  }
}
