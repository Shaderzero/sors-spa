import {Component, OnInit} from '@angular/core';
import {Manageability} from 'src/app/_models/references/manageability';
import {ActivatedRoute} from '@angular/router';
import {AlertifyService} from 'src/app/_services/alertify.service';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {ReferenceService} from '../../_services/reference.service';
import {NameModalComponent} from '../../modals/name-modal/name-modal.component';
import {ConfirmModalComponent} from '../../references/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-manageability-table',
  templateUrl: './manageability-table.component.html',
  styleUrls: ['./manageability-table.component.css']
})
export class ManageabilityTableComponent implements OnInit {
  modalRef: BsModalRef;
  manageabilities: Manageability[];

  constructor(private route: ActivatedRoute,
              private refService: ReferenceService,
              private modalService: BsModalService,
              private alertify: AlertifyService) {
  }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.manageabilities = data['manageabilities'];
    });
  }

  createManageability() {
    const initialState = {
      title: 'Создание управляемости риска',
      buttonName: 'Создать',
      values: this.manageabilities,
      value: {id: null, code: 0, name: ''},
      editMode: false
    };
    this.modalRef = this.modalService.show(NameModalComponent, {initialState});
    this.modalRef.content.outputValue.subscribe((result: Manageability) => {
      if (result) {
        this.create(result);
      }
    });
  }

  editManageability(manageability: Manageability) {
    const initialState = {
      title: 'Редактирование управляемости риска',
      buttonName: 'Изменить',
      values: this.manageabilities,
      value: manageability,
      editMode: true
    };
    this.modalRef = this.modalService.show(NameModalComponent, {initialState});
    this.modalRef.content.outputValue.subscribe((result: Manageability) => {
      if (result) {
        this.edit(result);
      }
    });
  }

  edit(manageability: Manageability) {
    this.refService.updateManageability(manageability).subscribe((res: Manageability) => {
      this.alertify.success('Управляемость риска успешно обновлена');
      for (let i = 0; i < this.manageabilities.length; i++) {
        if (+this.manageabilities[i].id === +res.id) {
          this.manageabilities[i] = res;
        }
      }
    }, error => {
      this.alertify.error('Ошибка обновления управляемости риска, ' + error);
    });
  }

  create(manageability: Manageability) {
    this.refService.createManageability(manageability).subscribe((res: Manageability) => {
      this.alertify.success('Новая управляемость риска успешно создана');
      this.manageabilities.push(res);
    }, error => {
      this.alertify.error('Ошибка создания новой управляемости риска, ' + error);
    });
  }

  deleteManageability(manageability: Manageability) {
    const initialState = {
      title: 'Удаление  управляемости риска',
      text: 'Удалить управляемость риска '
        + manageability.name + '?'
    };
    this.modalRef = this.modalService.show(ConfirmModalComponent, {ignoreBackdropClick: true, initialState});
    this.modalRef.content.result.subscribe((res: boolean) => {
      if (res) {
        this.refService.deleteManageability(manageability).subscribe(() => {
          this.alertify.success('Управляемость риска удалена');
          for (let i = 0; i < this.manageabilities.length; i++) {
            if (+this.manageabilities[i].id === +manageability.id) {
              this.manageabilities.splice(i, 1);
            }
          }
        }, error => {
          console.log(error);
          this.alertify.error('Ошибка удаления управляемости риска');
        });
      } else {
        this.alertify.message('Отмена');
      }
    });
  }
}
