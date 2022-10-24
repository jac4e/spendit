import {
  Component,
  Input,
  OnInit,
  HostListener,
  ViewChild,
  TemplateRef
} from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'client/app/_services';
import { getKeys, IAccount, ITransaction, IProduct, isITransaction } from 'typesit';

@Component({
  selector: 'app-view-modal',
  templateUrl: './view-modal.component.html',
  styleUrls: ['./view-modal.component.sass']
})
export class ViewModalComponent implements OnInit {
  closeResult = '';
  @Input() name!: string;
  @Input() model!: { [key: string]: any };
  modelProperties!: string[];
  @ViewChild('content') public content!: TemplateRef<any>;

  @HostListener('click') onClick() {
    this.open(this.content);
  }

  constructor(
    private modalService: NgbModal,
    public commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.modelProperties = getKeys(
      this.model as IAccount | ITransaction | IProduct
    );
    console.log(this.model, isITransaction(this.model));
  }

  open(content: any) {
    // console.log(this.model['date'].toLocaleString());
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
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
    setTimeout(() => {
      printWindow?.close();
    }, 500);
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
