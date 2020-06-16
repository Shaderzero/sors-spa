import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {AuthService} from '../../_services/auth.service';
import {AlertifyService} from '../../_services/alertify.service';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {TextDataService} from '../../_services/text-data.service';
import {TextData} from '../../_models/text-data';
import {NameValueModalComponent} from '../../modals/name-value-modal/name-value-modal.component';

@Component({
  selector: 'app-smart-name',
  templateUrl: './smart-name.component.html',
  styleUrls: ['./smart-name.component.css']
})
export class SmartNameComponent implements OnInit {
  @Input() name: string;
  textData: TextData;
  modalRef: BsModalRef;
  isAdmin = false;

  constructor(private textDataService: TextDataService,
              private fb: FormBuilder,
              private authService: AuthService,
              private alertify: AlertifyService,
              private modalService: BsModalService) {
  }

  ngOnInit() {
    this.isAdmin = this.authService.isAdmin();
    this.textData = this.textDataService.getTextData(this.name);
    // if (this.textData === null) {
    //   this.textDataService.getTextDataByName(this.name).subscribe((res: TextData) => {
    //     this.textData = res;
    //   });
    // }
  }

  edit() {
    if (this.textData == null) {
      this.create();
    } else {
      this.update();
    }
  }

  create() {
    const initialState = {
      title: 'Создание нового параметра',
      buttonName: 'Создать',
      value: {id: null, name: this.name, value: '', param: 'ru'},
      editMode: false
    };
    this.modalRef = this.modalService.show(NameValueModalComponent, {initialState});
    this.modalRef.content.outputValue.subscribe((result: TextData) => {
      if (result) {
        this.textDataService.createTextData(result).subscribe((res: TextData) => {
          this.alertify.success('Новое наименование успешно создано');
          this.textData = res;
        }, error => {
          this.alertify.error('Ошибка создания нового параметра, ' + error);
        });
      }
    });
  }

  update() {
    const initialState = {
      title: 'Редактирование параметра',
      buttonName: 'Изменить',
      value: this.textData,
      editMode: true
    };
    this.modalRef = this.modalService.show(NameValueModalComponent, {initialState});
    this.modalRef.content.outputValue.subscribe((result: TextData) => {
      if (result) {
        console.log(result);
        this.textDataService.updateTextData(result).subscribe((res: TextData) => {
          this.textData = res;
          this.alertify.success('наименование успешно обновлено');
        }, error => {
          this.alertify.error('Ошибка обновления наименования, ' + error);
        });
      }
    });
  }

}
