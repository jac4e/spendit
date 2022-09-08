import {
  Component,
  Input,
  OnInit,
  HostListener,
  ViewChild,
  TemplateRef
} from '@angular/core';
import {
  NgbModal,
  ModalDismissReasons,
  NgbModalRef
} from '@ng-bootstrap/ng-bootstrap';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { Observable } from 'rxjs';
import { AlertService } from 'client/app/_services';

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

  @HostListener('click') onClick() {
    this.open(this.content);
  }

  form!: UntypedFormGroup;
  loading = false;
  submitted = false;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private modalService: NgbModal,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.modelProperties = Object.getOwnPropertyNames(this.model);
    const options: { [key: string]: any } = {};
    this.modelProperties.forEach((prop) => {
      if (prop !== 'id' && prop !== 'balance') {
        options[prop] = [this.model[prop], [Validators.required]];
      }
    });
    this.form = this.formBuilder.group(options);
  }

  get f() {
    return this.form.controls;
  }
  onSubmit() {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    this.loading = true;
    this.submit(this.model['id'], this.form.value).subscribe({
      next: () => {
        this.loading = false;
        this.alertService.success(`Successfully updated ${this.model['id']}`, { autoClose: true, id: this.successAlert});
        this.modalRef.close();
      },
      error: (resp) => {
        this.alertService.error(resp.error.message, {id: 'modal-alert'});
        this.loading = false;
      }
    });
  }

  open(content: any) {
    // console.log(this.model['date'].toLocaleString());
    this.modalRef = this.modalService.open(content);
  }
  isArray(obj: any) {
    return Array.isArray(obj);
  }
  isObject(A: any) {
    return typeof A === 'object';
  }
  getProperties(obj: any) {
    return Object.getOwnPropertyNames(obj);
  }
  titleCase(string: string) {
    return string[0].toUpperCase() + string.slice(1).toLowerCase();
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
}
