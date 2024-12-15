import { Component, inject, Input, ViewChild } from '@angular/core';
import { UntypedFormBuilder, Validators, UntypedFormGroup } from '@angular/forms';
import { IAccount, RefillMethods, IRefill, keysIRefill } from 'typesit';
import { AccountService } from 'client/app/_services';
import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from 'client/app/_services';

import {
  injectStripe,
  StripePaymentElementComponent,
  StripeElementsDirective,
  StripeServiceInterface
} from 'ngx-stripe';
import {
  StripeElementsOptions, 
  StripePaymentElementOptions
} from '@stripe/stripe-js';
import { AppConfigService } from 'client/app/_services';
import { ListControl, ListControlType, SortEvent } from 'client/app/_models';
import { first, Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { NgIf } from '@angular/common';

const RefillStep = {
  ...RefillMethods,
  MethodSelection: "methodSelection"
};

type RefillStep = typeof RefillStep[keyof typeof RefillStep];

// Simple modal that displays the next steps for the user
@Component({
  selector: 'next-steps-modal-content',
  standalone: true,
  imports: [NgIf],
  template: `
    <div class="modal-header">
      <h4 class="modal-title" id="next-steps-modal">Next Steps</h4>
      <button type="button" class="btn-close" aria-label="Close" (click)="activeModal.dismiss('Cross click')"></button>
    </div>
    <div class="modal-body">
      <p [innerHTML]="nextStepString"></p>
    </div>
    <div class="modal-footer">
      <ng-container *ngIf="method==='${RefillMethods.Stripe}'">
        <button class="btn btn-primary" (click)="activeModal.close('Pay')">Go to Stripe</button>
      </ng-container>
      <button type="button" class="btn btn-secondary" (click)="activeModal.dismiss('Close click')">Close</button>
    </div>
  `
})
class NextStepsModalContent {
  @Input() method: string = '';
  @Input() nextStepString: string = '';
  constructor(public activeModal: NgbActiveModal) {}
}

@Component({
  selector: 'app-refill',
  templateUrl: './refill.component.html',
  styleUrls: ['./refill.component.sass'],
})
export class RefillComponent {
  stripe: StripeServiceInterface;
  account = {} as IAccount;
  requestedRefill: IRefill | null = null;
  refillForm!: UntypedFormGroup;
  refillStep: RefillStep = RefillStep.MethodSelection;
  refillSubmitted = false;
  // redirect = false;
  // redirectParameters = {
  //   success: false,
  //   refill: ''
  // };
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
      name: 'Steps',
      type: ListControlType.CustomButton,
      shouldDisplay: (data: IRefill) => {
        return data.status === 'pending';
      },
      onClick: (data: IRefill) => {
        // Show modal with instructions
        const modal = this.modalService.open(NextStepsModalContent);
        modal.componentInstance.nextStepString = this.refillMessages[data.method](data);
        modal.componentInstance.method = data.method;

        // Listen for modal close
        modal.result.then((result) => {
          if (result === 'Pay') {
            this.pay(data.reference);
          }
        });
      },
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
        this.accountService.cancelRefill(data.id).pipe(first()).subscribe({
          next: () => {
            this.alertService.success('Refill cancelled successfully');
          },
          error: (resp) => {
            this.alertService.error(resp.error.message, {autoClose: true,id: 'dashboard-alert'});
          }
        });
      },
    }
  ];
  refillMessages = {
    [RefillMethods.Cash]: (obj: IRefill) => `Please meet up with an exec to give them $${Number(obj.amount)/100} in cash. The exec will confirm the payment and update your account.`,
    [RefillMethods.Etransfer]: (obj: IRefill) => `Please send an interact e-transfer to <a href='mailto:epclub@ualberta.ca'>epclub@ualberta.ca</a> with the following message: "REFILL:${obj.id}".<br><br>
    If your bank does not allow the characters ':', use the message "REFILL&${obj.id}".<br><br>
    Some banks do not allow messages on transfers under $5. If this is the case, complete the transfer and send a message to <a href='mailto:epclub@ualberta.ca'>epclub@ualberta.ca</a>.<br><br>
    The etransfer should be processed within 5 minutes; contact an exec if it takes longer.`,
    [RefillMethods.Stripe]: (obj: IRefill) => `Click the button below to go to the checkout page. You will be redirected to the stripe website to complete the transaction and refill your account. Your checkout session will expire within 24 hours`,
    [RefillMethods.CreditCard]: (obj: IRefill) => `An email has been sent to the club with your request. One of the execs will let you know when you can meet up to make the payment.`,
    [RefillMethods.DebitCard]: (obj: IRefill) => `An email has been sent to the club with your request. One of the execs will let you know when you can meet up to make the payment.`,
  };

  constructor(
    private modalService: NgbModal,
    private appConfigService: AppConfigService,
    private accountService: AccountService,
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private alertService: AlertService) {

    this.accountService.account.subscribe((account) => {
      if (account !== null) {
        this.account = account;
      }
    });
    this.accountService.refreshAccount();
    this.stripe = injectStripe(this.appConfigService.stripePublicKey);
  }

  ngOnInit() {
    this.refillForm = this.formBuilder.group({
      amount: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      method: ['', [Validators.required]],
    });

    this.refillForm.controls['method'].valueChanges.subscribe((value) => {
      if (value === RefillMethods.Cash) {
        this.refillForm.controls['amount'].setValidators([Validators.required, Validators.pattern(/^\d+$/)]);
      } else {
        this.refillForm.controls['amount'].setValidators([Validators.required, Validators.pattern(/^\d+$/), Validators.min(50)]);
      }
      this.refillForm.controls['amount'].updateValueAndValidity();
    });
  }

  ngAfterViewInit() {
    // check query parameters
    const params = this.route.snapshot.queryParams;
    if (params['success'] !== undefined) {
      // Alert the user of the status of the refill
      if (params['success'] === 'true') {
        this.alertService.success(`Stripe payment for ${params['refill']} successful`, {
          // autoClose: true,
          id: 'refill-alert'
        });
      } else {
        this.alertService.error(`Stripe payment for ${params['refill']} failed`, {
          // autoClose: true,
          id: 'refill-alert'
        });
      }
    }
  }


  onSubmit() {
    // stop here if form is invalid
    if (this.refillForm.invalid) {
      // Find out what the issue is
      if (this.refillForm.controls["amount"].invalid) {
        this.alertService.warn("Please enter a valid amount", {
          autoClose: true,
          id: 'amount-alert'
        });
      }
      if (this.refillForm.controls["method"].invalid) {
        this.alertService.warn("Please select a refill method", {
          autoClose: true,
          id: 'method-alert'
        });
      }
      return;
    }

    // Submit the refill
    this.accountService.requestRefill(
      this.refillForm.value["method"],
      String(this.refillForm.value["amount"])
    ).subscribe({
      next: (refill) => {
        this.refillStep = this.refillForm.value["method"];
        this.refillSubmitted = true;
        this.requestedRefill = refill;
        this.refreshRefillHistory();
      },
      error: (error) => {
        this.alertService.error(error.error.message || error.message, {
          autoClose: true,
          id: 'refill-alert'
        });
      }
    });
    
  }

  refreshRefillHistory() {
    return this.accountService.getRefillHistory()
  }

  // Replace with your own public key
  paying = false;

  pay(reference: string) {
    if (this.paying) return;
    this.paying = true;

    this.stripe.redirectToCheckout({ sessionId: reference }).subscribe({
      error: (error) => {
        this.alertService.error(error.error.message || error.message, {
          autoClose: true,
          id: 'refill-alert'
        });
      }
    });
  }

  getFormAmount(method: string) {
    return (Number(this.refillForm.get('amount')?.value) || 0)/100;
  }

  getSurcharge(method: string) {
    const amount = Number(this.refillForm.get('amount')?.value) || 0;

    if (amount===0) return 0;

    switch (method) {
      case RefillMethods.Stripe:
        return (Math.round((amount + 30) / (1 - 0.029)) - amount)/100;
      case RefillMethods.CreditCard:
        return (Math.round((amount + 5) / (1 - 0.027)) - amount)/100;
      case RefillMethods.DebitCard:
        return (Math.round(amount + 15) - amount)/100;
      default:
        return 0;
    }
  }
}
