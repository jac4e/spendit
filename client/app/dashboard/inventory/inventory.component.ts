import { Component, OnInit } from '@angular/core';
import { AdminService } from 'client/app/_services/admin.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs';
import { Product } from 'client/app/_models';
import { CommonService, StoreService } from 'client/app/_services';

@Component({
  selector: 'app-dashboard-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.sass']
})
export class InventoryComponent implements OnInit {
  inventory!: Product[];
  form!: FormGroup;
  loading = false;
  submitted = false;
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private storeService: StoreService,
    private adminService: AdminService,
    private commonService: CommonService
    ) {
    this.storeService.getInventory().subscribe((inventory: Product[]) => {
      this.inventory = inventory;
    });
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      price: [
        null,
        [
          Validators.required,
          Validators.min(0)
        ]
      ],
      stock: [
        0,
        [Validators.required, Validators.min(0), Validators.pattern('^[0-9]*$')]
      ],
      description: ['']
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
          this.loading = false;
          this.storeService.getInventory().subscribe((inventory: Product[]) => {
            this.inventory = inventory;
          });
        }
      });
  }
}