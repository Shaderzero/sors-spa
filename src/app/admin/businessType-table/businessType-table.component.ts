import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AlertifyService} from 'src/app/_services/alertify.service';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {BusinessType} from '../../_models/references/businessType';
import {CodeNameModalComponent} from '../../modals/code-name-modal/code-name-modal.component';
import {ConfirmModalComponent} from '../../references/confirm-modal/confirm-modal.component';
import {ReferenceService} from '../../_services/reference.service';

@Component({
  selector: 'app-businesstype-table',
  templateUrl: './businessType-table.component.html',
  styleUrls: ['./businessType-table.component.css']
})
export class BusinessTypeTableComponent implements OnInit {
  modalRef: BsModalRef;
  btypes: BusinessType[];

  constructor(private route: ActivatedRoute,
              private refService: ReferenceService,
              private modalService: BsModalService,
              private alertify: AlertifyService) {
  }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.btypes = data['btypes'];
    });
  }

  createBT() {
    const initialState = {
      title: 'Создание вида бизнеса',
      buttonName: 'Создать',
      values: this.btypes,
      value: {id: null, code: 0, name: ''},
      editMode: false
    };
    this.modalRef = this.modalService.show(CodeNameModalComponent, {initialState});
    this.modalRef.content.outputValue.subscribe((result: BusinessType) => {
      if (result) {
        this.create(result);
      }
    });
  }

  editBT(bt: BusinessType) {
    const initialState = {
      title: 'Редактирование вида бизнеса',
      buttonName: 'Изменить',
      values: this.btypes,
      value: bt,
      editMode: true
    };
    this.modalRef = this.modalService.show(CodeNameModalComponent, {initialState});
    this.modalRef.content.outputValue.subscribe((result: BusinessType) => {
      if (result) {
        this.edit(result);
      }
    });
  }

  edit(bt: BusinessType) {
    this.refService.updateBusinessType(bt).subscribe((res: BusinessType) => {
      this.alertify.success('Вид бизнеса успешно обновлен');
      for (let i = 0; i < this.btypes.length; i++) {
        if (+this.btypes[i].id === +res.id) {
          this.btypes[i] = res;
        }
      }
    }, error => {
      this.alertify.error('Ошибка обновления вида бизнеса, ' + error);
    });
  }

  create(bt: BusinessType) {
    this.refService.createBusinessType(bt).subscribe((res: BusinessType) => {
      this.alertify.success('Новый вид бизнеса успешно создан');
      this.btypes.push(res);
    }, error => {
      this.alertify.error('Ошибка создания нового вида бизнеса, ' + error);
    });
  }

  deleteBT(bt: BusinessType) {
    const initialState = {
      title: 'Удаление вида бизнеса',
      text: 'Удалить вид бизнеса ' + bt.name
    };
    this.modalRef = this.modalService.show(ConfirmModalComponent, {ignoreBackdropClick: true, initialState});
    this.modalRef.content.result.subscribe((res: boolean) => {
      if (res) {
        this.refService.deleteBusinessType(bt).subscribe(() => {
          for (let i = 0; i < this.btypes.length; i++) {
            if (+this.btypes[i].id === +bt.id) {
              this.btypes.splice(i, 1);
              this.alertify.success('Вид бизнеса удалён');
              break;
            }
          }
        }, error => {
          console.log(error);
          this.alertify.error('Ошибка удаления вида бизнеса');
        });
      } else {
        this.alertify.message('Отмена');
      }
    });
  }
}

