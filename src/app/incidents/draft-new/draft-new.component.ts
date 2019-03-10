import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { Draft } from 'src/app/_models/draft';
import { ConfirmCommentModalComponent } from 'src/app/references/confirm-comment-modal/confirm-comment-modal.component';
import { DraftService } from 'src/app/_services/draft.service';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-draft-new',
  templateUrl: './draft-new.component.html',
  styleUrls: ['./draft-new.component.css']
})
export class DraftNewComponent implements OnInit {
  model: any = {};
  draftForm: FormGroup;
  modalRef: BsModalRef;
  comment: string;

  constructor(private draftService: DraftService,
      private alertify: AlertifyService,
      private modalService: BsModalService,
      private fb: FormBuilder,
      private router: Router,
      private authService: AuthService) {
       }

  ngOnInit() {
    this.createDraftForm();
  }

  createDraftForm() {
    this.draftForm = this.fb.group({
      description1: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(200)]],
      description2: ['', [Validators.maxLength(1000)]],
      description3: ['', [Validators.maxLength(1000)]],
      description4: ['', [Validators.maxLength(1000)]],
      description5: ['', [Validators.maxLength(1000)]]
    });
  }

  approveModal() {
    const initialState = {
      title: 'Cоздать новое рисковое событие?'
    };
    this.modalRef = this.modalService.show(ConfirmCommentModalComponent, {initialState});
    this.modalRef.content.outputComment.subscribe((comment) => {
      this.create(comment);
    });
  }

  create(comment: string) {
    if (this.draftForm.valid) {
      this.model = Object.assign({}, this.draftForm.value);
      this.model.comment = comment;
      this.model.authorId = this.authService.currentUser.id;
      this.model.departmentId = this.authService.currentUser.department.id;
      this.model.status = 'draft';
      this.draftService.createDraft(this.model).subscribe((draft: Draft) => {
        this.alertify.success('РС успешно создано');
        this.router.navigate(['/incidents/drafts/' + draft.id]);
      }, error => {
        console.log(error);
        this.alertify.error('ошибка создания РС');
      });
    }
  }

  cancel() {
    this.alertify.message('отмена');
    this.router.navigate(['/incidents/drafts/list']);
  }

}
