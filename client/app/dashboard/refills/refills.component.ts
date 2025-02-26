import { Component, OnInit, ViewChild } from '@angular/core';
import { IRefill } from 'typesit';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { AdminService, AlertService } from 'client/app/_services';
import { first, Observable } from 'rxjs';
import { ListControl, ListControlType, SortEvent } from 'client/app/_models';
import { ListComponent } from 'client/app/app-common/list/list.component';

@Component({
  selector: 'app-dashboard-refills',
  templateUrl: './refills.component.html',
  styleUrls: ['./refills.component.sass']
})

export class RefillsComponent implements OnInit {
  @ViewChild(ListComponent)
  private listComponent!: ListComponent;
  listDefaultSort: SortEvent = { column: 'dateCreated', direction: 'desc' };
  listControl: ListControl[] = [
    {
      name: 'View',
      type: ListControlType.View,
      shouldDisplay: (data: IRefill) => {
        return true;
      }
    },
    {
      name: 'Approve',
      type: ListControlType.CustomButton,
      shouldDisplay: (data: IRefill) => {
        return data.status === 'pending';
      },
      onClick: (data: IRefill) => {
        // popup confirmation dialog
        if (!confirm('Are you sure you want to approve this refill?')) {
          return;
        }

        // call approve refill
        this.adminService.approveRefill(data.id).pipe(first()).subscribe({
          next: () => {
            this.alertService.success('Refill approved successfully');
          },
          error: (resp) => {
            this.alertService.error(resp.error.message, {autoClose: true,id: 'dashboard-alert'});
          }
        });
      }
    },
    {
      name: 'Cancel',
      type: ListControlType.CustomButton,
      shouldDisplay: (data: IRefill) => {
        return data.status === 'pending' && data.method !== 'stripe';
      },
      onClick: (data: IRefill) => {
        // popup confirmation dialog
        if (!confirm('Are you sure you want to cancel this refill?')) {
          return;
        }

        // call cancel refill
        this.adminService.cancelRefill(data.id).pipe(first()).subscribe({
          next: () => {
            this.alertService.success('Refill cancelled successfully');
          },
          error: (resp) => {
            this.alertService.error(resp.error.message, {autoClose: true,id: 'dashboard-alert'});
          }
        });
      }
    }
  ];

  constructor(
    private formBuilder: UntypedFormBuilder,
    private adminService: AdminService,
    private alertService: AlertService
  ) {
  }

  refreshRefills() {
    return this.adminService.getAllRefills();
  }

  ngOnInit(): void {
  }
}