import {Component, OnInit} from '@angular/core';
import {Draft} from 'src/app/_models/draft';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from 'src/app/_services/auth.service';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {ConfirmModalComponent} from 'src/app/references/confirm-modal/confirm-modal.component';
import {AlertifyService} from 'src/app/_services/alertify.service';
import {MailService} from 'src/app/_services/mail.service';
import {DraftService} from 'src/app/_services/draft.service';
import {ConfirmCommentModalComponent} from 'src/app/references/confirm-comment-modal/confirm-comment-modal.component';
import {CountsService} from '../../_services/counts.service';

@Component({
  selector: 'app-draft-info',
  templateUrl: './draft-info.component.html',
  styleUrls: ['./draft-info.component.css']
})
export class DraftInfoComponent implements OnInit {
  draft: Draft;
  model: any = {};
  modalRef: BsModalRef;
  canEdit: boolean;
  canCheck: boolean;
  canSign: boolean;
  canOpen: boolean;
  canDelete: boolean;
  canRefine: boolean;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private modalService: BsModalService,
              private authService: AuthService,
              private draftService: DraftService,
              private alertify: AlertifyService,
              private mailService: MailService,
              private countsService: CountsService) {
  }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.draft = data['draft'];
      this.fillParameters();
    });
  }

  fillParameters() {
    const status = this.draft.status;
    this.canEdit = false;
    this.canCheck = false;
    this.canSign = false;
    this.canOpen = false;
    this.canDelete = false;
    this.canRefine = false;
    let isAuthor = false;
    let isRc = false;
    let isRm = false;
    if (this.authService.roleMatch(['admin'])
      && this.authService.currentUser.department.id === this.draft.department.id) {
      isRm = true;
      this.canEdit = true;
      this.canCheck = true;
      this.canSign = true;
      this.canOpen = true;
      this.canDelete = true;
      this.canRefine = true;
      return;
    }
    if (+this.authService.currentUser.id === +this.draft.author.id) {
      isAuthor = true;
    }
    if (this.authService.roleMatch(['riskCoordinator'])
      && this.authService.currentUser.department.id === this.draft.department.id) {
      isRc = true;
    }
    if (this.authService.roleMatch(['riskManager'])) {
      isRm = true;
    }
    if (status === 'open' || status === 'closed') {
      return;
    } else if (status === 'sign') {
      if (isRm) {
        this.canOpen = true;
        this.canRefine = true;
      }
    } else if (status === 'check') {
      if (isRm) {
        this.canOpen = true;
        this.canSign = true;
      } else if (isRc) {
        this.canRefine = true;
        this.canSign = true;
        this.canEdit = true;
      }
    } else if (status === 'draft') {
      if (isAuthor) {
        this.canCheck = true;
        this.canEdit = true;
        this.canDelete = true;
      }
    } else if (status === 'refine') {
      if (isAuthor) {
        this.canCheck = true;
        this.canEdit = true;
        this.canDelete = true;
      } else if (isRc) {
        this.canSign = true;
        this.canEdit = true;
      }
    }
  }

  checkModal() {
    const initialState = {
      title: 'Отправить сообщение о рисковом событии риск координатору?'
    };
    this.modalRef = this.modalService.show(ConfirmCommentModalComponent, {initialState});
    this.modalRef.content.outputComment.subscribe((comment) => {
      this.model.comment = comment;
      this.setStatus('check');
    });
  }

  signModal() {
    const initialState = {
      title: 'Отправить сообщение о рисковом событии риск менеджеру?'
    };
    this.modalRef = this.modalService.show(ConfirmCommentModalComponent, {initialState});
    this.modalRef.content.outputComment.subscribe((comment) => {
      this.model.comment = comment;
      this.setStatus('sign');
    });
  }

  refineModal() {
    const initialState = {
      title: 'Отправить сообщение о рисковом событии на доработку?'
    };
    this.modalRef = this.modalService.show(ConfirmCommentModalComponent, {initialState});
    this.modalRef.content.outputComment.subscribe((comment) => {
      this.model.comment = comment;
      this.setStatus('refine');
    });
  }

  setStatus(status: string) {
    this.model.id = this.draft.id;
    this.model.status = status;
    this.model.authorId = this.authService.currentUser.id;
    this.model.departmentId = this.authService.currentUser.department.id;
    this.draftService.setStatus(this.model).subscribe(() => {
      this.draft.status = status;
      this.fillParameters();
      this.countsService.loadAll();
      this.notificateStatus();
    }, error => {
      console.log(error);
      this.alertify.error('ошибка отправки РС риск координатору');
    });
  }

  notificateStatus() {
    const status = this.draft.status;
    switch (status) {
      case 'check':
        this.alertify.success('Сообщение о рисковом событии отправлено риск координатору');
        this.mailService.sendDraftCheck(this.draft, this.model.comment);
        break;
      case'sign':
        this.alertify.success('Сообщение о рисковом событии отправлено риск менеджеру');
        this.mailService.sendDraftSign(this.draft, this.model.comment);
        break;
      case'refine':
        this.alertify.success('Сообщение о рисковом событии отправлено на доработку');
        this.mailService.sendDraftRefine(this.draft, this.model.comment);
        break;
      default:
        break;
    }
  }

  delete() {
    const initialState = {
      title: 'Удаление сообщения о рисковом событии',
      text: 'Удалить сообщение о рисковом событии: "' + this.draft.description1 + '"?'
    };
    this.modalRef = this.modalService.show(ConfirmModalComponent, {ignoreBackdropClick: true, initialState});
    this.modalRef.content.result.subscribe((res: boolean) => {
      if (res) {
        this.draftService.deleteDraft(this.draft).subscribe(() => {
          this.router.navigate(['/incidents/drafts/list']);
          this.countsService.counts.countDraft--;
          this.alertify.success('Сообщение о РС удалено');
        }, error => {
          console.log(error);
          this.alertify.error('Ошибка удаления сообщения о РС');
        });
      } else {
        this.alertify.message('Отмена');
      }
    });
  }

}
