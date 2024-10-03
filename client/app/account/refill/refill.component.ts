import { Component, inject, ViewChild } from '@angular/core';
import { UntypedFormBuilder, Validators, UntypedFormGroup } from '@angular/forms';
import { IAccount } from 'typesit';
import { AccountService } from 'client/app/_services';
import { AlertService } from 'client/app/_services';

import {
  injectStripe,
  StripePaymentElementComponent
} from 'ngx-stripe';
import {
  StripeElementsOptions, 
  StripePaymentElementOptions
} from '@stripe/stripe-js';
import { AppConfigService } from 'client/app/_services';

enum RefillStep {
  MethodSelection = "methodSelection",
  Cash = "cash",
  Etransfer = "etransfer",
  Card = "card",
  Stripe = "stripe"
}

@Component({
  selector: 'app-refill',
  templateUrl: './refill.component.html',
  styleUrls: ['./refill.component.sass'],
})
export class RefillComponent {
  account = {} as IAccount;
  methodSelectionForm!: UntypedFormGroup;
  refillStep: RefillStep = RefillStep.MethodSelection;
  constructor(
    private appConfigService: AppConfigService,
    private accountService: AccountService,
    private formBuilder: UntypedFormBuilder,
    private alertService: AlertService) {

    this.accountService.account.subscribe((account) => {
      if (account !== null) {
        this.account = account;
      }
    });
    this.accountService.refreshAccount();
  }

  ngOnInit() {
    this.methodSelectionForm = this.formBuilder.group({
      method: ['', [Validators.required]],
    });
  }

  methodSelection() {
    // stop here if form is invalid
    if (this.methodSelectionForm.invalid) {
      this.alertService.warn("Please select a refill method", {
        autoClose: true,
        id: 'refill-alert'
      });
      return;
    }

    this.refillStep = this.methodSelectionForm.value["method"];
    console.log('Refill step', this.refillStep)
    
  }


  // test sstripe stuff below

  @ViewChild(StripePaymentElementComponent) paymentElement!: StripePaymentElementComponent;
  private readonly fb = inject(UntypedFormBuilder);
  paymentElementForm = this.fb.group({
    name: ['John Doe', [Validators.required]],
    email: ['support@ngx-stripe.dev', [Validators.required]],
    address: [''],
    zipcode: [''],
    city: [''],
    amount: [2500, [Validators.required, Validators.pattern(/\d+/)]]
  });

  elementsOptions: StripeElementsOptions = {
    locale: 'en',
    // client: '{{YOUR_CLIENT_SECRET}}',
    appearance: {
      theme: 'flat'
    }
  };

  paymentElementOptions: StripePaymentElementOptions = {
    layout: {
      type: 'tabs',
      defaultCollapsed: false,
      radios: false,
      spacedAccordionItems: false
    }
  };

  // Replace with your own public key
  stripe = injectStripe(this.appConfigService.stripePublicKey);
  paying = false;

  pay() {
    if (this.paying || this.paymentElementForm.invalid) return;
    this.paying = true;

    const {
      name,
      email,
      address,
      zipcode,
      city
    } = this.paymentElementForm.getRawValue();

    this.stripe
      .confirmPayment({
        elements: this.paymentElement.elements,
        confirmParams: {
          payment_method_data: {
            billing_details: {
              name: name as string,
              email: email as string,
              address: {
                line1: address as string,
                postal_code: zipcode as string,
                city: city as string
              }
            }
          }
        },
        redirect: 'if_required'
      })
      .subscribe(result => {
        this.paying = false;
        if (result.error) {
          // Show error to your customer (e.g., insufficient funds)
          alert({ success: false, error: result.error.message });
        } else {
          // The payment has been processed!
          if (result.paymentIntent.status === 'succeeded') {
            // Show a success message to your customer
            alert({ success: true });
          }
        }
      });
  }
}
