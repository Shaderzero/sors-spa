import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {AlertifyService} from '../../_services/alertify.service';
import {ConfirmModalComponent} from '../../references/confirm-modal/confirm-modal.component';
import {NameValueModalComponent} from '../../modals/name-value-modal/name-value-modal.component';
import {TextData} from '../../_models/text-data';
import {TextDataService} from '../../_services/text-data.service';

@Component({
  selector: 'app-text-data-table',
  templateUrl: './text-data-table.component.html',
  styleUrls: ['./text-data-table.component.css']
})
export class TextDataTableComponent implements OnInit {
  modalRef: BsModalRef;
  datas: TextData[];

  constructor(private route: ActivatedRoute,
              private textDataService: TextDataService,
              private modalService: BsModalService,
              private alertify: AlertifyService) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.datas = data['datas'];
    });
  }

  createText() {
    const initialState = {
      title: 'Создание нового параметра',
      buttonName: 'Создать',
      values: this.datas,
      value: {id: null, name: '', value: '', param: ''},
      editMode: false
    };
    this.modalRef = this.modalService.show(NameValueModalComponent, {initialState});
    this.modalRef.content.outputValue.subscribe((result: TextData) => {
      if (result) {
        this.create(result);
      }
    });
  }

  editText(data: TextData) {
    const initialState = {
      title: 'Редактирование параметра',
      buttonName: 'Изменить',
      values: this.datas,
      value: data,
      editMode: true
    };
    this.modalRef = this.modalService.show(NameValueModalComponent, {initialState});
    this.modalRef.content.outputValue.subscribe((result: TextData) => {
      if (result) {
        this.edit(result);
      }
    });
  }

  edit(data: TextData) {
    this.textDataService.updateTextData(data).subscribe((res: TextData) => {
      this.alertify.success('Параметр успешно обновлен');
      for (let i = 0; i < this.datas.length; i++) {
        if (+this.datas[i].id === +res.id) {
          this.datas[i] = res;
        }
      }
    }, error => {
      this.alertify.error('Ошибка обновления параметра, ' + error);
    });
  }

  create(data: TextData) {
    this.textDataService.createTextData(data).subscribe((res: TextData) => {
      this.alertify.success('Новый параметр успешно создан');
      this.datas.push(res);
    }, error => {
      this.alertify.error('Ошибка создания нового параметра, ' + error);
    });
  }

  deleteText(data: TextData) {
    const initialState = {
      title: 'Удаление параметра',
      text: 'Удалить параметр (' + data.param + ') ' + data.name + '?'
    };
    this.modalRef = this.modalService.show(ConfirmModalComponent, {ignoreBackdropClick: true, initialState});
    this.modalRef.content.result.subscribe((res: boolean) => {
      if (res) {
        this.textDataService.deleteTextData(data.id).subscribe(() => {
          this.alertify.success('Параметр удален');
        }, error => {
          console.log(error);
          this.alertify.error('Ошибка удаления параметра');
        });
      } else {
        this.alertify.message('Отмена');
      }
    });
  }
}
