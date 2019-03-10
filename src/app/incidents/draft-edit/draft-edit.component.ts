import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {AlertifyService} from 'src/app/_services/alertify.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Draft} from 'src/app/_models/draft';
import {ConfirmCommentModalComponent} from 'src/app/references/confirm-comment-modal/confirm-comment-modal.component';
import {DraftService} from 'src/app/_services/draft.service';
import {AuthService} from 'src/app/_services/auth.service';

@Component({
  selector: 'app-draft-edit',
  templateUrl: './draft-edit.component.html',
  styleUrls: ['./draft-edit.component.css']
})
export class DraftEditComponent implements OnInit {
  model: any = {};
  draftForm: FormGroup;
  modalRef: BsModalRef;
  comment: string;
  draft: Draft;

  constructor(private draftService: DraftService,
              private alertify: AlertifyService,
              private authService: AuthService,
              private modalService: BsModalService,
              private fb: FormBuilder,
              private route: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.draft = data['draft'];
      if (this.checkAbility()) {
        this.createDraftForm();
      } else {
        this.router.navigate(['/incidents/drafts/' + this.draft.id]);
      }
    });
  }

  createDraftForm() {
    this.draftForm = this.fb.group({
      description1: [this.draft.description1, [Validators.required, Validators.minLength(4), Validators.maxLength(200)]],
      description2: [this.draft.description2, [Validators.maxLength(1000)]],
      description3: [this.draft.description3, [Validators.maxLength(1000)]],
      description4: [this.draft.description4, [Validators.maxLength(1000)]],
      description5: [this.draft.description5, [Validators.maxLength(1000)]]
    });
  }

  checkAbility() {
    if ((this.draft.status !== 'draft')
      && (this.draft.status !== 'check')
      && (this.draft.status !== 'refine')) {
      if (!this.authService.isAdmin()) {
        this.alertify.error('Вы не можете произвести редактирование данного сообщения');
        return false;
      } else {
        this.alertify.message('Предоставлен доступ администратора');
        return true;
      }
    } else {
      return true;
    }
  }

  approveModal() {
    const initialState = {
      title: 'Сохранить изменения рискового события?'
    };
    this.modalRef = this.modalService.show(ConfirmCommentModalComponent, {initialState});
    this.modalRef.content.outputComment.subscribe((comment) => {
      this.edit(comment);
    });
  }

  edit(comment: string) {
    if (this.draftForm.valid) {
      this.model = Object.assign({}, this.draftForm.value);
      this.model.id = this.draft.id;
      this.model.comment = comment;
      this.model.authorId = this.authService.currentUser.id;
      this.model.departmentId = this.authService.currentUser.department.id;
      // this.model.status = 'draft'; // статус сбрасваемили нет?
      this.draftService.updateDraft(this.model).subscribe((draft: Draft) => {
        this.alertify.success('РС успешно изменено');
        this.router.navigate(['/incidents/drafts/' + draft.id]);
      }, error => {
        console.log(error);
        this.alertify.error('ошибка создания РС');
      });
    }
  }

  cancel() {
    this.alertify.message('отмена');
    this.router.navigate(['/incidents/drafts/' + this.draft.id]);
  }

}
