import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Draft} from '../../_models/draft';
import {DraftService} from '../../_services/draft.service';
import {AlertifyService} from '../../_services/alertify.service';
import {BsModalRef} from 'ngx-bootstrap';

@Component({
  selector: 'app-incident-draft-modal',
  templateUrl: './incident-draft-modal.component.html',
  styleUrls: ['./incident-draft-modal.component.css']
})
export class IncidentDraftModalComponent implements OnInit {
  drafts: Draft[];
  @Output() selectedDrafts = new EventEmitter();

  constructor(public modalRef: BsModalRef,
              private draftService: DraftService,
              private alertify: AlertifyService) {
  }

  ngOnInit() {
    this.getDrafts();
  }

  getDrafts() {
    this.draftService.getDraftsForIncident().subscribe((res: Draft[]) => {
      this.drafts = res;
    }, error => {
      console.log(error);
      this.alertify.error('Ошибка получения данных');
    });
  }

  cancel() {
    this.modalRef.hide();
    this.alertify.message('отмена');
  }

  ok() {
    const selectedDrafts: Draft[] = [];
    if (this.drafts.length > 0) {
      for (let i = 0; i < this.drafts.length; i++) {
        const draft = this.drafts[i];
        if (draft.checked) {
          selectedDrafts.push(this.drafts[i]);
        }
      }
    }
    this.selectedDrafts.emit(selectedDrafts);
    this.modalRef.hide();
  }

}
