import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {BsModalRef} from 'ngx-bootstrap';

@Component({
  selector: 'app-text-edit-modal',
  templateUrl: './text-edit-modal.component.html',
  styleUrls: ['./text-edit-modal.component.css']
})
export class TextEditModalComponent implements OnInit {
  @Output() outputText = new EventEmitter();
  title: string;
  inputText: string;
  editForm: FormGroup;

  constructor(public modalRef: BsModalRef, private fb: FormBuilder) { }

  ngOnInit() {
    this.createCommentForm();
  }

  createCommentForm() {
    this.editForm = this.fb.group({
      inputText: [this.inputText, [Validators.maxLength(1000)]]
    });
  }

  ok() {
    this.outputText.emit(this.editForm.get('inputText').value);
    this.modalRef.hide();
  }
}
