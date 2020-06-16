import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AlertifyService} from 'src/app/_services/alertify.service';
import {ActivatedRoute, Router} from '@angular/router';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {Draft} from 'src/app/_models/draft';
import {ConfirmCommentModalComponent} from 'src/app/references/confirm-comment-modal/confirm-comment-modal.component';
import {DraftService} from 'src/app/_services/draft.service';
import {AuthService} from 'src/app/_services/auth.service';
import {CountsService} from '../../_services/counts.service';
import {TextDataService} from '../../_services/text-data.service';
import {IncidentType} from '../../_models/references/IncidentType';
import {TextData} from '../../_models/text-data';

@Component({
  selector: 'app-draft-new',
  templateUrl: './draft-new.component.html',
  styleUrls: ['./draft-new.component.css']
})
export class DraftNewComponent implements OnInit {
  model: any = {};
  draftForm: FormGroup;
  modalRef: BsModalRef;
  mode: string;
  example = false;
  examples: Draft[];
  incidentTypes: IncidentType[];
  comment: string;
  eIncidentType: string;
  eDesc1: string;
  eDesc2: string;
  eDesc3: string;
  eDesc4: string;
  eDesc5: string;
  description1Placeholder = '';
  description2Placeholder = '';
  description3Placeholder = '';
  description4Placeholder = '';
  description5Placeholder = '';

  constructor(private draftService: DraftService,
              private alertify: AlertifyService,
              private modalService: BsModalService,
              private fb: FormBuilder,
              private router: Router,
              private authService: AuthService,
              private countsService: CountsService,
              private textDataService: TextDataService,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.loadPlaceholders();
    this.mode = this.route.snapshot.data.mode;
    this.route.data.subscribe(data => {
      if (this.mode !== 'newExample') {
        this.examples = data.drafts.result;
      }
      this.incidentTypes = data.incidentTypes;
    });
    this.createDraftForm();
  }

  loadPlaceholders() {
    this.description1Placeholder = this.textDataService.getTextDataValue('Description1Placeholder');
    this.description2Placeholder = this.textDataService.getTextDataValue('Description2Placeholder');
    this.description3Placeholder = this.textDataService.getTextDataValue('Description3Placeholder');
    this.description4Placeholder = this.textDataService.getTextDataValue('Description4Placeholder');
    this.description5Placeholder = this.textDataService.getTextDataValue('Description5Placeholder');
  }

  createDraftForm() {
    this.draftForm = this.fb.group({
      incidentTypeId: [1, Validators.required],
      description1: ['', [Validators.maxLength(200)]],
      description2: ['', [Validators.required, Validators.maxLength(1000)]],
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
      if (this.mode === 'newExample') {
        this.model.status = 'example';
      } else {
        this.model.status = 'draft';
      }
      this.draftService.createDraft(this.model).subscribe((draft: Draft) => {
        if (this.mode === 'newExample') {
          this.alertify.success('Пример РС успешно создан');
          this.router.navigate(['/admin/examples']);
        } else {
          this.alertify.success('РС успешно создано');
          this.countsService.updateCounts();
          this.router.navigate(['/incidents/drafts/' + draft.id]);
        }
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

  showExample(e: Draft) {
    if (e.incidentType !== null && e.incidentType !== undefined) {
      this.eIncidentType = e.incidentType.name;
    }
    this.eDesc1 = e.description1;
    this.eDesc2 = e.description2;
    this.eDesc3 = e.description3;
    this.eDesc4 = e.description4;
    this.eDesc5 = e.description5;
    this.example = true;
  }

}
