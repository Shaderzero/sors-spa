import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {AlertifyService} from 'src/app/_services/alertify.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Draft} from 'src/app/_models/draft';
import {ConfirmCommentModalComponent} from 'src/app/references/confirm-comment-modal/confirm-comment-modal.component';
import {DraftService} from 'src/app/_services/draft.service';
import {AuthService} from 'src/app/_services/auth.service';
import {IncidentType} from '../../_models/references/IncidentType';
import {TextDataService} from '../../_services/text-data.service';
import {isNotNullOrUndefined} from 'codelyzer/util/isNotNullOrUndefined';

@Component({
  selector: 'app-draft-edit',
  templateUrl: './draft-edit.component.html',
  styleUrls: ['./draft-edit.component.css']
})
export class DraftEditComponent implements OnInit {
  model: any = {};
  draftForm: FormGroup;
  modalRef: BsModalRef;
  incidentTypes: IncidentType[];
  comment: string;
  draft: Draft;
  description1Placeholder = '';
  description2Placeholder = '';
  description3Placeholder = '';
  description4Placeholder = '';
  description5Placeholder = '';

  constructor(private draftService: DraftService,
              private textDataService: TextDataService,
              private alertify: AlertifyService,
              private authService: AuthService,
              private modalService: BsModalService,
              private fb: FormBuilder,
              private route: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit() {
    this.loadPlaceholders();
    this.route.data.subscribe(data => {
      this.draft = data.draft;
      this.incidentTypes = data.incidentTypes;
      if (this.checkAbility()) {
        this.createDraftForm();
      } else {
        this.router.navigate(['/incidents/drafts/' + this.draft.id]);
      }
    });
  }

  loadPlaceholders() {
    this.description1Placeholder = this.textDataService.getTextDataValue('Description1Placeholder');
    this.description2Placeholder = this.textDataService.getTextDataValue('Description2Placeholder');
    this.description3Placeholder = this.textDataService.getTextDataValue('Description3Placeholder');
    this.description4Placeholder = this.textDataService.getTextDataValue('Description4Placeholder');
    this.description5Placeholder = this.textDataService.getTextDataValue('Description5Placeholder');
    // this.textDataService.getTextDataByName('description1Placeholder').subscribe(res => {
    //   this.description1Placeholder = res.value;
    // });
    // this.textDataService.getTextDataByName('description2Placeholder').subscribe(res => {
    //   this.description2Placeholder = res.value;
    // });
    // this.textDataService.getTextDataByName('description3Placeholder').subscribe(res => {
    //   this.description3Placeholder = res.value;
    // });
    // this.textDataService.getTextDataByName('description4Placeholder').subscribe(res => {
    //   this.description4Placeholder = res.value;
    // });
    // this.textDataService.getTextDataByName('description5Placeholder').subscribe(res => {
    //   this.description5Placeholder = res.value;
    // });
  }

  createDraftForm() {
    this.draftForm = this.fb.group({
      incidentTypeId: [this.getIncidentType(), Validators.required],
      description1: [this.draft.description1, [Validators.maxLength(200)]],
      description2: [this.draft.description2, [Validators.required, Validators.maxLength(1000)]],
      description3: [this.draft.description3, [Validators.maxLength(1000)]],
      description4: [this.draft.description4, [Validators.maxLength(1000)]],
      description5: [this.draft.description5, [Validators.maxLength(1000)]]
    });
  }

  getIncidentType(): number {
    if (this.draft.incidentType === null || this.draft.incidentType === undefined) {
      return -1;
    }
    return this.draft.incidentType.id;
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
