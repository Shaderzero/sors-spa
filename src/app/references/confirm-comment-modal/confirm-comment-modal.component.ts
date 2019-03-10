import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap';

@Component({
  selector: 'app-comment-confirm-modal',
  templateUrl: './confirm-comment-modal.component.html',
  styleUrls: ['./confirm-comment-modal.component.css']
})
export class ConfirmCommentModalComponent implements OnInit {
  @Output() outputComment = new EventEmitter();
  title: string;
  text: string;
  commentForm: FormGroup;
  model: any = {};

  constructor(public modalRef: BsModalRef, private fb: FormBuilder) { }

  ngOnInit() {
    this.createCommentForm();
  }

  createCommentForm() {
    this.commentForm = this.fb.group({
      comment: ['', [Validators.maxLength(500)]]
    });
  }

  ok() {
    this.model = Object.assign({}, this.commentForm.value);
    this.outputComment.emit(this.model.comment);
    this.modalRef.hide();
  }
}
