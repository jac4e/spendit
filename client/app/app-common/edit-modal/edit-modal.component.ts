import {
  Component,
  Input,
  OnInit,
  HostListener,
  ViewChild,
  TemplateRef,
  Output,
  EventEmitter
} from '@angular/core';
import {
  NgbModal,
  ModalDismissReasons,
  NgbModalRef
} from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { AlertService } from 'client/app/_services';
import { CommonService } from 'client/app/_services';
import { getKeys, IAccount, IProduct, isIAccount, ITransaction } from 'typesit';

@Component({
  selector: 'app-edit-modal',
  templateUrl: './edit-modal.component.html',
  styleUrls: ['./edit-modal.component.sass']
})
export class EditModalComponent implements OnInit {
  closeResult = '';
  modalRef!: NgbModalRef;
  @Input() name!: string;
  @Input() successAlert!: string;
  @Input() model!: { [key: string]: any };
  @Input() submit!: (id: string, content: any) => Observable<any>;
  modelProperties!: string[];
  @ViewChild('content') public content!: TemplateRef<any>;
  @Output() modifiedItemEvent = new EventEmitter();

  @HostListener('click') onClick() {
    this.open(this.content);
  }

  form!: FormGroup;
  controls: { [key: string]: any } = {};
  loading = false;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private alertService: AlertService,
    public commonService: CommonService
  ) {}

  ngOnInit(): void {
    // console.log(this.model);
    this.modelProperties = getKeys(
      this.model as IAccount | ITransaction | IProduct
    )
      .map((key) => {
        // remove restricted keys
        if (key === 'id' || key === 'balance' || key === 'gid') {
          return '';
        }
        return key;
      })
      .filter((key) => key !== '') as string[];

    // // If model is account, add password and confirm password keys
    // if (isIAccount(this.model)) {
    //   // add keys
    //   this.modelProperties.push('password');
    //   this.modelProperties.push('confirmPassword');
    // }
  }

  get f() {
    return this.form.controls;
  }

  generateForm() {
    this.modelProperties.forEach((key) => {
      // console.log(key);
      const value = this.model[key];
      const validatorsArr = [Validators.required];
      if (key === 'email') {
        validatorsArr.push(Validators.email);
      }
      this.controls[key] = [value, validatorsArr];
    });
    this.form = this.formBuilder.group(this.controls);
  }

  onSubmit() {
    // Popup confirmation
    if (!confirm('Are you sure you want to save your changes?')) {
      return;
    }

    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    // convert to IAccountForm if needed
    const form = this.form.value;
    // console.log(form);
    // if (form['confirmPassword']) {
    //   delete form['confirmPassword'];
    // }

    this.loading = true;
    this.submit(this.model['id'], form).subscribe({
      next: () => {
        this.loading = false;
        this.alertService.success(`Successfully updated ${this.model['id']}`, {
          autoClose: true,
          id: this.successAlert
        });
        // console.log('emitting event');
        this.modifiedItemEvent.emit();
        this.modalRef.close();
      },
      error: (resp) => {
        this.alertService.error(resp.error.message, {
          autoClose: true,
          id: 'modal-alert'
        });
        this.loading = false;
      }
    });
  }

  open(content: any) {
    // console.log(this.model['date'].toLocaleString());
    this.modalRef = this.modalService.open(content);
    this.generateForm();
  }
  print() {
    const printContent = document
      .getElementById('print')
      ?.innerHTML.replace('table-flush', 'table-striped');
    const printWindow = window.open('', 'PRINT', 'height=400,width=600');
    printWindow?.document.write(
      '<html><link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous"><body>' +
        printContent +
        '</body></html>'
    );
    printWindow?.document.close();
    printWindow?.focus();
    printWindow?.print();
    setTimeout(function () {
      printWindow?.close();
    }, 200);
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  isPassword(input: string) {
    return input.includes('assword');
  }
}
