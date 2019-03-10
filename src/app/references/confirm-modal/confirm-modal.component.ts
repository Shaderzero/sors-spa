import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.css']
})
export class ConfirmModalComponent implements OnInit {
  @Output() result = new EventEmitter();
  title: string;
  text: string;

  constructor(public modalRef: BsModalRef, private fb: FormBuilder) { }

  ngOnInit() {
  }

  confirm() {
    this.result.emit(true);
    this.modalRef.hide();
  }

  decline() {
    this.result.emit(false);
    this.modalRef.hide();
  }

}
