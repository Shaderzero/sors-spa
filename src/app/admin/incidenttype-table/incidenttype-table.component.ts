import {Component, OnInit} from '@angular/core';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {ActivatedRoute} from '@angular/router';
import {ReferenceService} from '../../_services/reference.service';
import {AlertifyService} from '../../_services/alertify.service';
import {ConfirmModalComponent} from '../../references/confirm-modal/confirm-modal.component';
import {IncidentType} from '../../_models/references/IncidentType';
import {NameModalComponent} from '../../modals/name-modal/name-modal.component';

@Component({
  selector: 'app-incidenttype-table',
  templateUrl: './incidenttype-table.component.html',
  styleUrls: ['./incidenttype-table.component.css']
})
export class IncidenttypeTableComponent implements OnInit {
  modalRef: BsModalRef;
  incidentTypes: IncidentType[];

  constructor(private route: ActivatedRoute,
              private refService: ReferenceService,
              private modalService: BsModalService,
              private alertify: AlertifyService) {
  }

  ngOnInit() {
    console.log('inside init component');
    this.route.data.subscribe(data => {
      this.incidentTypes = data['incidenttypes'];
    });
  }

  createEntity() {
    const initialState = {
      title: 'Создание категории рисковых событий',
      buttonName: 'Создать',
      values: this.incidentTypes,
      value: {id: null, name: ''},
      editMode: false
    };
    this.modalRef = this.modalService.show(NameModalComponent, {initialState});
    this.modalRef.content.outputValue.subscribe((result: IncidentType) => {
      if (result) {
        this.create(result);
      }
    });
  }

  editEntity(incidentType: IncidentType) {
    const initialState = {
      title: 'Редактирование категории рискового события',
      buttonName: 'Изменить',
      values: this.incidentTypes,
      value: incidentType,
      editMode: true
    };
    this.modalRef = this.modalService.show(NameModalComponent, {initialState});
    this.modalRef.content.outputValue.subscribe((result: IncidentType) => {
      if (result) {
        this.edit(result);
      }
    });
  }

  edit(entity: IncidentType) {
    this.refService.updateIncidentType(entity).subscribe((res: IncidentType) => {
      this.alertify.success('Категория рискового события успешно обновлена');
      for (let i = 0; i < this.incidentTypes.length; i++) {
        if (+this.incidentTypes[i].id === +res.id) {
          this.incidentTypes[i] = res;
        }
      }
    }, error => {
      this.alertify.error('Ошибка обновления категории рискового события, ' + error);
    });
  }

  create(entity: IncidentType) {
    this.refService.createIncidentType(entity).subscribe((res: IncidentType) => {
      this.alertify.success('Новая категория рискового события успешно создана');
      this.incidentTypes.push(res);
    }, error => {
      this.alertify.error('Ошибка создания новой категории рискового события, ' + error);
    });
  }

  delete(entity: IncidentType) {
    const initialState = {
      title: 'Удаление категории рискового события',
      text: 'Удалить категорию рискового события (' + entity.id + ') ' + entity.name + '?'
    };
    this.modalRef = this.modalService.show(ConfirmModalComponent, {ignoreBackdropClick: true, initialState});
    this.modalRef.content.result.subscribe((res: boolean) => {
      if (res) {
        this.refService.deleteIncidentType(entity.id).subscribe(() => {
          this.alertify.success('Категория рискового события удалена');
        }, error => {
          console.log(error);
          this.alertify.error('Ошибка удаления категории рискового события');
        });
      } else {
        this.alertify.message('Отмена');
      }
    });
  }
}
