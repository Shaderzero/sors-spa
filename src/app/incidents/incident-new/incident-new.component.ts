import {Component, NgZone, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {BsLocaleService, BsModalRef, BsModalService} from 'ngx-bootstrap';
import {AlertifyService} from 'src/app/_services/alertify.service';
import {AuthService} from 'src/app/_services/auth.service';
import {ActivatedRoute, ActivatedRouteSnapshot, Router} from '@angular/router';
import {Draft} from 'src/app/_models/draft';
import {Incident} from 'src/app/_models/incident';
import {Department} from 'src/app/_models/department';
import {ConfirmCommentModalComponent} from 'src/app/references/confirm-comment-modal/confirm-comment-modal.component';
import {Responsible} from 'src/app/_models/responsible';
import {IncidentService} from 'src/app/_services/incident.service';
import {DraftService} from 'src/app/_services/draft.service';
import {MailService} from 'src/app/_services/mail.service';
import {CountsService} from '../../_services/counts.service';
import {IncidentType} from '../../_models/references/IncidentType';

@Component({
  selector: 'app-incident-new',
  templateUrl: './incident-new.component.html',
  styleUrls: ['./incident-new.component.css']
})
export class IncidentNewComponent implements OnInit {
  model: any = {};
  incident: Incident;
  drafts: Draft[] = [];
  inputDraft: Draft;
  departments: Department[] = [];
  incidentTypes: IncidentType[];
  incidentForm: FormGroup;
  modalRef: BsModalRef;
  comment: string;
  bsValue = new Date();
  draftOpen = false;
  ownerOpen = false;

  constructor(private localeService: BsLocaleService,
              private route: ActivatedRoute,
              private incidentService: IncidentService,
              private draftService: DraftService,
              private alertify: AlertifyService,
              private authService: AuthService,
              private modalService: BsModalService,
              private fb: FormBuilder,
              private mailService: MailService,
              private router: Router,
              private countsService: CountsService,
              private zone: NgZone) {
  }

  ngOnInit() {
    this.localeService.use('ru');
    this.createEventForm();
    this.route.data.subscribe(data => {
      this.drafts = data.drafts;
      this.departments = data.departments;
      this.incidentTypes = data.incidenttypes;
      this.route.params.subscribe(params => {
        this.inputDraft = params as Draft;
        if (this.inputDraft) {
          // this.incidentForm.patchValue({dateIncident: this.inputDraft.dateCreate});
          this.incidentForm.patchValue({description: this.inputDraft.description2});
          this.drafts.forEach(draft => {
            if (+draft.id === +this.inputDraft.id) {
              draft.checked = true;
            }
          });
        }
      });
    });
  }

  createEventForm() {
    this.incidentForm = this.fb.group({
      incidentTypeId: [1, Validators.required],
      description: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(1000)]],
      dateIncident: [this.bsValue, Validators.required]
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

  getResponsibles(): Responsible[] {
    const responsibles: Responsible[] = [];
    for (let i = 0; i < this.departments.length; i++) {
      if (this.departments[i].checked) {
        const responsible: Responsible = {
          department: this.departments[i],
          result: 'wait'
        };
        responsibles.push(responsible);
      }
    }
    return responsibles;
  }

  getSelectedDrafts(): Draft[] {
    const drafts: Draft[] = [];
    for (let i = 0; i < this.drafts.length; i++) {
      if (this.drafts[i].checked) {
        this.drafts[i].status = 'open';
        drafts.push(this.drafts[i]);
      }
    }
    return drafts;
  }

  create(comment: string) {
    const selectedDrafts = this.getSelectedDrafts();
    const responsibles = this.getResponsibles();
    if (selectedDrafts.length === 0) {
      this.alertify.error('не выбраны сообщения о РС');
    // } else if (responsibles.length === 0) {
    //   this.alertify.error('не выбраны ответственные');
    } else if (this.incidentForm.valid) {
      this.model = Object.assign({}, this.incidentForm.value);
      this.incident = {
        description: this.model.description,
        dateIncident: this.model.dateIncident,
        incidentTypeId: this.model.incidentTypeId,
        comment: comment,
        status: 'wait',
        authorId: this.authService.currentUser.id,
        responsibles: responsibles,
        drafts: selectedDrafts
      };
      this.incidentService.createIncident(this.incident).subscribe((incident: Incident) => {
        this.alertify.success('РС успешно создано');
        // this.mailService.sendIncidentAssign(incident, comment);
        for (let i = 0; i < selectedDrafts.length; i++) {
          this.setDraftStatus(selectedDrafts[i]);
        }
        this.zone.run(() => {
          this.router.navigate(['/incidents/' + incident.id]);
        });
      }, error => {
        console.log(error);
        this.alertify.error('ошибка создания РС');
      }, () => {
        this.countsService.updateCounts();
      });
    }
  }

  setDraftStatus(draft: Draft) {
    this.model = {};
    this.model.id = draft.id;
    this.model.status = 'open';
    this.model.authorId = this.authService.currentUser.id;
    this.model.departmentId = this.authService.currentUser.department.id;
    this.draftService.setStatus(this.model).subscribe(() => {
      this.alertify.message('статус сообщения о РС обновлён');
    }, error => {
      console.log(error);
      this.alertify.error('ошибка обновления статуса сообщения о РС');
    });
  }

  cancel() {
    this.alertify.message('отмена');
    this.router.navigate(['/incidents/drafts/sign']);
  }
}
