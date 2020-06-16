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
      this.draft = data.draft;
    });
  }

  canEdit(): boolean {
    if (this.isAdmin()) return true;
    if (this.isAuthor() && this.status() === 'draft') return true;
    if (this.isAuthor() && this.status() === 'refine') return true;
    if (this.isRC() && this.status() === 'check') return true;
    if (this.isRC() && this.status() === 'refine') return true;
    return false;
  }

  canCheck(): boolean {
    if (this.status() === 'example') return false;
    if (this.isAdmin()) return true;
    if (this.isAuthor() && this.status() === 'draft') return true;
    if (this.isAuthor() && this.status() === 'refine') return true;
    return false;
  }

  canSign(): boolean {
    if (this.status() === 'example') return false;
    if (this.isAdmin()) return true;
    if (this.isRC() && this.status() === 'check') return true;
    if (this.isRC() && this.status() === 'refine') return true;
    if (this.isRM() && this.status() === 'check') return true;
    if (this.isRM() && this.status() === 'refine') return true;
    return false;
  }

  canOpen(): boolean {
    if (this.status() === 'example') return false;
    if (this.isAdmin()) return true;
    if (this.isRM() && this.status() === 'check') return true;
    if (this.isRM() && this.status() === 'sign') return true;
    if (this.isRM() && this.status() === 'refine') return true;
    return false;
  }

  canDelete(): boolean {
    if (this.isAdmin()) return true;
    if (this.isAuthor() && this.status() === 'draft') return true;
    if (this.isAuthor() && this.status() === 'refine') return true;
    return false;
  }

  canRefine(): boolean {
    if (this.status() === 'example') return false;
    if (this.isAdmin()) return true;
    if (this.isRC() && this.status() === 'check') return true;
    if (this.isRM() && this.status() === 'check') return true;
    if (this.isRM() && this.status() === 'sign') return true;
    return false;
  }

  isAdmin(): boolean {
    if (this.authService.roleMatch(['admin'])) {
      return true;
    } else {
      return false;
    }
  }

  isRC(): boolean {
    if (this.authService.roleMatch(['riskCoordinator'])
      && +this.authService.currentUser.department.id === +this.draft.department.id) {
      return true;
    } else {
      return false;
    }
  }

  isAuthor(): boolean {
    if (+this.authService.currentUser.id === +this.draft.author.id) {
      return true;
    } else {
      return false;
    }
  }

  isRM(): boolean {
    if (this.authService.roleMatch(['riskManager'])) {
      return true;
    } else {
      return false;
    }
  }

  status(): string {
    return this.draft.status;
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
      this.countsService.updateCounts();
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
        // this.mailService.sendDraftCheck(this.draft, this.model.comment);
        break;
      case'sign':
        this.alertify.success('Сообщение о рисковом событии отправлено риск менеджеру');
        // this.mailService.sendDraftSign(this.draft, this.model.comment);
        break;
      case'refine':
        this.alertify.success('Сообщение о рисковом событии отправлено на доработку');
        // this.mailService.sendDraftRefine(this.draft, this.model.comment);
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
          this.countsService.updateCounts();
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
