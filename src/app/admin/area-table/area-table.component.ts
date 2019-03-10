import {Component, OnInit} from '@angular/core';
import {Area} from 'src/app/_models/references/area';
import {ActivatedRoute} from '@angular/router';
import {AlertifyService} from 'src/app/_services/alertify.service';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {CodeNameModalComponent} from '../../modals/code-name-modal/code-name-modal.component';
import {ConfirmModalComponent} from '../../references/confirm-modal/confirm-modal.component';
import {ReferenceService} from '../../_services/reference.service';

@Component({
  selector: 'app-area-table',
  templateUrl: './area-table.component.html',
  styleUrls: ['./area-table.component.css']
})
export class AreaTableComponent implements OnInit {
  modalRef: BsModalRef;
  areas: Area[];

  constructor(private route: ActivatedRoute,
              private refService: ReferenceService,
              private modalService: BsModalService,
              private alertify: AlertifyService) {
  }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.areas = data['areas'];
    });
  }

  createArea() {
    const initialState = {
      title: 'Создание сферы возникновения риска',
      buttonName: 'Создать',
      values: this.areas,
      value: {id: null, code: 0, name: ''},
      editMode: false
    };
    this.modalRef = this.modalService.show(CodeNameModalComponent, {initialState});
    this.modalRef.content.outputValue.subscribe((result: Area) => {
      if (result) {
        this.create(result);
      }
    });
  }

  editArea(area: Area) {
    const initialState = {
      title: 'Редактирование сферы возникновения риска',
      buttonName: 'Изменить',
      values: this.areas,
      value: area,
      editMode: true
    };
    this.modalRef = this.modalService.show(CodeNameModalComponent, {initialState});
    this.modalRef.content.outputValue.subscribe((result: Area) => {
      if (result) {
        this.edit(result);
      }
    });
  }

  edit(area: Area) {
    this.refService.updateArea(area).subscribe((res: Area) => {
      this.alertify.success('Сфера возникновения риска успешно обновлена');
      for (let i = 0; i < this.areas.length; i++) {
        if (+this.areas[i].id === +res.id) {
          this.areas[i] = res;
        }
      }
    }, error => {
      this.alertify.error('Ошибка обновления сферы возникновения риска, ' + error);
    });
  }

  create(area: Area) {
    this.refService.createArea(area).subscribe((res: Area) => {
      this.alertify.success('Новая сфера возникновения риска успешно создана');
      this.areas.push(res);
    }, error => {
      this.alertify.error('Ошибка создания новой сферы возникновения риска, ' + error);
    });
  }

  deleteArea(area: Area) {
    const initialState = {
      title: 'Удаление сферы возникновения риска',
      text: 'Удалить сферу возникновения риска (' + area.code + ') ' + area.name + '?'
    };
    this.modalRef = this.modalService.show(ConfirmModalComponent, {ignoreBackdropClick: true, initialState});
    this.modalRef.content.result.subscribe((res: boolean) => {
      if (res) {
        this.refService.deleteArea(area).subscribe(() => {
          this.alertify.success('Сфера возникновения риска удалена');
        }, error => {
          console.log(error);
          this.alertify.error('Ошибка удаления сферы возникновения риска');
        });
      } else {
        this.alertify.message('Отмена');
      }
    });
  }
}
