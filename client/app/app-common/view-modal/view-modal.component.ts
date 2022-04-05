import { Component, Input, OnInit, HostListener, ViewChild, TemplateRef } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-view-modal',
  templateUrl: './view-modal.component.html',
  styleUrls: ['./view-modal.component.sass']
})
export class ViewModalComponent implements OnInit {
  closeResult = '';
  @Input() name!: string;
  @Input() model!: {[key: string]: any};
  modelProperties!: string[];
  @ViewChild('content') public content!: TemplateRef<any>;

  @HostListener("click") onClick(){
    this.open(this.content);
  }

  constructor(private modalService: NgbModal) {
  }

  ngOnInit(): void {
    this.modelProperties = Object.getOwnPropertyNames(this.model);
  }

  open(content: any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  isArray(obj : any ) {
    return Array.isArray(obj)
  }
  isObject(A: any) {
    return typeof A === "object"
  }
  getProperties(obj: any){
    return Object.getOwnPropertyNames(obj);
  }
  titleCase(string: string){
    return string[0].toUpperCase() + string.slice(1).toLowerCase();
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
