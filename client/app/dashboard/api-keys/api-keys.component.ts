import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { AdminService, AlertService } from 'client/app/_services';
import { BehaviorSubject, first, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { IApiKey } from 'typesit';
import { ListControl, ListControlType, SortEvent } from 'client/app/_models';
import { ListComponent } from 'client/app/app-common/list/list.component';

@Component({
  selector: 'app-dashboard-api-keys',
  templateUrl: './api-keys.component.html',
  styleUrls: ['./api-keys.component.sass']
})
export class ApiKeysComponent implements OnInit {
  @ViewChild(ListComponent)
  private listComponent!: ListComponent;

  selectForm!: UntypedFormGroup;
  createForm!: UntypedFormGroup;
  submittedSelect = false;
  submittedCreate = false;
  loading = false;
  selectedUserId = '';
  lastCreatedKey: string | null = null;
  lastCreatedName: string | null = null;

  listDefaultSort: SortEvent = { column: 'createdAt', direction: 'desc' };
  listControl: ListControl[] = [
    {
      name: 'Delete',
      type: ListControlType.CustomButton,
      shouldDisplay: () => true,
      onClick: (data: IApiKey) => {
        this.deleteKey(data);
      }
    }
  ];
  private refreshUserId$ = new BehaviorSubject<string>('');
  getData$ = this.refreshUserId$.pipe(
    switchMap((userId) => {
      if (!userId) {
        return of([]);
      }
      return this.adminService.getApiKeysForUser(userId);
    })
  );

  constructor(
    private formBuilder: UntypedFormBuilder,
    private adminService: AdminService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.selectForm = this.formBuilder.group({
      userId: ['', Validators.required]
    });
    this.createForm = this.formBuilder.group({
      userId: ['', Validators.required],
      name: ['', [Validators.required, Validators.maxLength(64)]]
    });
  }

  get selectF() {
    return this.selectForm.controls;
  }

  get createF() {
    return this.createForm.controls;
  }

  onSelectUser() {
    this.submittedSelect = true;
    if (this.selectForm.invalid) {
      return;
    }
    this.selectedUserId = this.selectForm.value.userId.trim();
    this.lastCreatedKey = null;
    this.lastCreatedName = null;
    this.refreshUserId$.next(this.selectedUserId);
    this.listComponent.refreshData();
  }

  onCreateKey() {
    this.submittedCreate = true;
    if (this.createForm.invalid) {
      return;
    }

    const userId = this.createForm.value.userId.trim();
    const name = this.createForm.value.name.trim();

    if (!confirm(`Create API key "${name}" for user ${userId}?`)) {
      return;
    }

    this.loading = true;
    this.adminService
      .createApiKeyForUser(userId, name)
      .pipe(first())
      .subscribe({
        next: (resp) => {
          this.loading = false;
          this.selectedUserId = userId;
          this.selectForm.patchValue({ userId });
          this.lastCreatedKey = resp.apiKey;
          this.lastCreatedName = resp.key.name;
          this.refreshUserId$.next(this.selectedUserId);
          this.alertService.success('API key created successfully', {
            autoClose: true,
            id: 'dashboard-alert'
          });
          this.listComponent.refreshData();
        },
        error: (resp) => {
          this.loading = false;
          this.alertService.error(resp.error.message, {
            autoClose: true,
            id: 'dashboard-alert'
          });
        }
      });
  }

  deleteKey(key: IApiKey) {
    if (!confirm(`Delete API key "${key.name}" for user ${key.userId}?`)) {
      return;
    }
    this.adminService.deleteApiKeyForUser(key.userId, key.name).subscribe({
      next: () => {
        this.alertService.success('API key deleted successfully', {
          autoClose: true,
          id: 'dashboard-alert'
        });
        this.listComponent.refreshData();
      },
      error: (resp) => {
        this.alertService.error(resp.error.message, {
          autoClose: true,
          id: 'dashboard-alert'
        });
      }
    });
  }
}
