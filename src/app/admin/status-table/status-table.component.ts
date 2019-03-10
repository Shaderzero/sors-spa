import {Component, OnInit} from '@angular/core';
import {RiskStatus} from 'src/app/_models/references/riskStatus';
import {ActivatedRoute} from '@angular/router';
import {AlertifyService} from 'src/app/_services/alertify.service';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {ReferenceService} from '../../_services/reference.service';
import {NameModalComponent} from '../../modals/name-modal/name-modal.component';
import {ConfirmModalComponent} from '../../references/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-status-table',
  templateUrl: './status-table.component.html',
  styleUrls: ['./status-table.component.css']
})
export class StatusTableComponent implements OnInit {
  modalRef: BsModalRef;
  riskStatuses: RiskStatus[];

  constructor(private route: ActivatedRoute,
              private refService: ReferenceService,
              private modalService: BsModalService,
              private alertify: AlertifyService) {
  }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.riskStatuses = data['statuses'];
    });
  }

  createRiskStatus() {
    const initialState = {
      title: 'Создание статуса риска',
      buttonName: 'Создать',
      values: this.riskStatuses,
      value: {id: null, code: 0, name: ''},
      editMode: false
    };
    this.modalRef = this.modalService.show(NameModalComponent, {initialState});
    this.modalRef.content.outputValue.subscribe((result: RiskStatus) => {
      if (result) {
        this.create(result);
      }
    });
  }

  editRiskStatus(riskStatus: RiskStatus) {
    const initialState = {
      title: 'Редактирование статуса риска',
      buttonName: 'Изменить',
      values: this.riskStatuses,
      value: riskStatus,
      editMode: true
    };
    this.modalRef = this.modalService.show(NameModalComponent, {initialState});
    this.modalRef.content.outputValue.subscribe((result: RiskStatus) => {
      if (result) {
        this.edit(result);
      }
    });
  }

  edit(riskStatus: RiskStatus) {
    this.refService.updateRiskStatus(riskStatus).subscribe((res: RiskStatus) => {
      this.alertify.success('Статус риска успешно обновлён');
      for (let i = 0; i < this.riskStatuses.length; i++) {
        if (+this.riskStatuses[i].id === +res.id) {
          this.riskStatuses[i] = res;
        }
      }
    }, error => {
      this.alertify.error('Ошибка обновления статуса риска, ' + error);
    });
  }

  create(riskStatus: RiskStatus) {
    this.refService.createRiskStatus(riskStatus).subscribe((res: RiskStatus) => {
      this.alertify.success('Новый статус риска успешно создан');
      this.riskStatuses.push(res);
    }, error => {
      this.alertify.error('Ошибка создания нового статуса риска, ' + error);
    });
  }

  deleteRiskStatus(riskStatus: RiskStatus) {
    const initialState = {
      title: 'Удаление статуса риска',
      text: 'Удалить статус риска '
        + riskStatus.name + '?'
    };
    this.modalRef = this.modalService.show(ConfirmModalComponent, {ignoreBackdropClick: true, initialState});
    this.modalRef.content.result.subscribe((res: boolean) => {
      if (res) {
        this.refService.deleteRiskStatus(riskStatus).subscribe(() => {
          this.alertify.success('Статус риска удалён');
          for (let i = 0; i < this.riskStatuses.length; i++) {
            if (+this.riskStatuses[i].id === +riskStatus.id) {
              this.riskStatuses.splice(i, 1);
            }
          }
        }, error => {
          console.log(error);
          this.alertify.error('Ошибка удаления статуса риска');
        });
      } else {
        this.alertify.message('Отмена');
      }
    });
  }
}
