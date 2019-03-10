import { Component, OnInit } from '@angular/core';
import { Duration } from 'src/app/_models/references/duration';
import { ActivatedRoute } from '@angular/router';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import {ReferenceService} from '../../_services/reference.service';
import {CodeNameModalComponent} from '../../modals/code-name-modal/code-name-modal.component';
import {ConfirmModalComponent} from '../../references/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-duration-table',
  templateUrl: './duration-table.component.html',
  styleUrls: ['./duration-table.component.css']
})
export class DurationTableComponent implements OnInit {
  modalRef: BsModalRef;
  durations: Duration[];

  constructor(private route: ActivatedRoute,
              private refService: ReferenceService,
              private modalService: BsModalService,
              private alertify: AlertifyService) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.durations = data['durations'];
    });
  }

  createDuration() {
    const initialState = {
      title: 'Создание длительности воздействия риска',
      buttonName: 'Создать',
      values: this.durations,
      value: {id: null, code: 0, name: ''},
      editMode: false
    };
    this.modalRef = this.modalService.show(CodeNameModalComponent, {initialState});
    this.modalRef.content.outputValue.subscribe((result: Duration) => {
      if (result) {
        this.create(result);
      }
    });
  }

  editDuration(duration: Duration) {
    const initialState = {
      title: 'Редактирование длительности воздействия риска',
      buttonName: 'Изменить',
      values: this.durations,
      value: duration,
      editMode: true
    };
    this.modalRef = this.modalService.show(CodeNameModalComponent, {initialState});
    this.modalRef.content.outputValue.subscribe((result: Duration) => {
      if (result) {
        this.edit(result);
      }
    });
  }

  edit(duration: Duration) {
    this.refService.updateDuration(duration).subscribe((res: Duration) => {
      this.alertify.success('Длительность воздействия риска успешно обновлена');
      for (let i = 0; i < this.durations.length; i++) {
        if (+this.durations[i].id === +res.id) {
          this.durations[i] = res;
        }
      }
    }, error => {
      this.alertify.error('Ошибка обновления длительности воздействия риска, ' + error);
    });
  }

  create(duration: Duration) {
    this.refService.createDuration(duration).subscribe((res: Duration) => {
      this.alertify.success('Новая Длительность воздействия риска успешно создана');
      this.durations.push(res);
    }, error => {
      this.alertify.error('Ошибка создания новой длительности воздействия риска, ' + error);
    });
  }

  deleteDuration(duration: Duration) {
    const initialState = {
      title: 'Удаление длительности риска',
      text: 'Удалить длительноть воздействия риска?'
    };
    this.modalRef = this.modalService.show(ConfirmModalComponent, {ignoreBackdropClick: true, initialState});
    this.modalRef.content.result.subscribe((res: boolean) => {
      if (res) {
        this.refService.deleteDuration(duration).subscribe(() => {
          this.alertify.success('Длительность воздействия риска удалена');
          for (let i = 0; i < this.durations.length; i++) {
            if (+this.durations[i].id === +duration.id) {
              this.durations.splice(i, 1);
            }
          }
        }, error => {
          console.log(error);
          this.alertify.error('Ошибка удаления длительности воздействия риска');
        });
      } else {
        this.alertify.message('Отмена');
      }
    });
  }
}
