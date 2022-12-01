import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-dashboard-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.sass']
})
export class InventoryComponent implements OnInit {
  inventory!: IProduct[];
  form!: UntypedFormGroup;
  loading = false;
  submitted = false;
  updateProduct;
  constructor(
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private storeService: StoreService,
    private adminService: AdminService,
    private commonService: CommonService,
    private alertService: AlertService
  ) {
    this.refreshList();
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
    // console.log('remove', id);
    this.adminService.removeProduct(id).subscribe({
      next: () => {
        this.refreshList();
      },
      error: (resp) => {
        this.alertService.error(resp.error.message);
      }
    });
  }
  refreshList() {
    this.storeService.getInventory().subscribe((inventory: IProduct[]) => {
      this.inventory = inventory;
    });
  }
  onSubmit() {
    this.submitted = true;

    // reset alerts on submit
    // this.alertService.clear();

    // stop here if form is invalid
    if (this.form.invalid) {
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
          this.refreshList();
        },
        error: (resp) => {
          this.alertService.error(resp.error.message, {autoClose: true,id: 'dashboard-alert'});
          this.loading = false;
        }
      });
  }
}
