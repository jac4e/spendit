import { Component, OnInit } from '@angular/core';
import { AdminService } from 'client/app/_services/admin.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs';
import { Product } from 'client/app/_models';
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
  inventory!: Product[];
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
    this.storeService.getInventory().subscribe((inventory: Product[]) => {
      this.inventory = inventory;
    });
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
    this.storeService.getInventory().subscribe((data: Product[]) => {
      this.commonService.export(
        data,
        `inventory_${this.commonService.localeISOTime()}.csv`
      );
    });
  }
  remove(id: string) {
    console.log('remove', id);
    this.adminService.removeProduct(id).subscribe({
      next: () => {
        this.storeService.getInventory().subscribe((inventory: Product[]) => {
          this.inventory = inventory;
        });
      },
      error: (resp) => {
        this.alertService.error(resp.error.message);
      }
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
          this.storeService.getInventory().subscribe((inventory: Product[]) => {
            this.inventory = inventory;
          });
        },
        error: (resp) => {
          this.alertService.error(resp.error.message, {id: 'dashboard-alert'});
          this.loading = false;
        }
      });
  }
}
