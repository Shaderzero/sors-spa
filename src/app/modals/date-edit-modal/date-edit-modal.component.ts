import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {BsLocaleService, BsModalRef} from 'ngx-bootstrap';

@Component({
  selector: 'app-date-edit-modal',
  templateUrl: './date-edit-modal.component.html',
  styleUrls: ['./date-edit-modal.component.css']
})
export class DateEditModalComponent implements OnInit {
  @Output() outputDate = new EventEmitter();
  title: string;
  editForm: FormGroup;
  inputDate: Date;

  constructor(public modalRef: BsModalRef,
              private fb: FormBuilder,
              private localeService: BsLocaleService) { }

  ngOnInit() {
    this.localeService.use('ru');
    this.createCommentForm();
  }

  createCommentForm() {
    this.editForm = this.fb.group({
      inputDate: [this.inputDate, [Validators.required]]
    });
  }

  ok() {
    this.outputDate.emit(this.editForm.get('inputDate').value);
    this.modalRef.hide();
  }
}
