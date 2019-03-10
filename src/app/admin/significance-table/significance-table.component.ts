import {Component, OnInit} from '@angular/core';
import {Significance} from 'src/app/_models/references/significance';
import {ActivatedRoute} from '@angular/router';
import {AlertifyService} from 'src/app/_services/alertify.service';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {ReferenceService} from '../../_services/reference.service';
import {NameModalComponent} from '../../modals/name-modal/name-modal.component';
import {ConfirmModalComponent} from '../../references/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-significance-table',
  templateUrl: './significance-table.component.html',
  styleUrls: ['./significance-table.component.css']
})
export class SignificanceTableComponent implements OnInit {
  modalRef: BsModalRef;
  significances: Significance[];

  constructor(private route: ActivatedRoute,
              private refService: ReferenceService,
              private modalService: BsModalService,
              private alertify: AlertifyService) {
  }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.significances = data['significances'];
    });
  }

  createSignificance() {
    const initialState = {
      title: 'Создание уровня значимости риска',
      buttonName: 'Создать',
      values: this.significances,
      value: {id: null, code: 0, name: ''},
      editMode: false
    };
    this.modalRef = this.modalService.show(NameModalComponent, {initialState});
    this.modalRef.content.outputValue.subscribe((result: Significance) => {
      if (result) {
        this.create(result);
      }
    });
  }

  editSignificance(significance: Significance) {
    const initialState = {
      title: 'Редактирование уровня значимости риска',
      buttonName: 'Изменить',
      values: this.significances,
      value: significance,
      editMode: true
    };
    this.modalRef = this.modalService.show(NameModalComponent, {initialState});
    this.modalRef.content.outputValue.subscribe((result: Significance) => {
      if (result) {
        this.edit(result);
      }
    });
  }

  edit(significance: Significance) {
    this.refService.updateSignificance(significance).subscribe((res: Significance) => {
      this.alertify.success('Уровень значимости риска успешно обновлен');
      for (let i = 0; i < this.significances.length; i++) {
        if (+this.significances[i].id === +res.id) {
          this.significances[i] = res;
        }
      }
    }, error => {
      this.alertify.error('Ошибка обновления уровня значимости риска, ' + error);
    });
  }

  create(significance: Significance) {
    this.refService.createSignificance(significance).subscribe((res: Significance) => {
      this.alertify.success('Новый уровень значимости риска успешно создан');
      this.significances.push(res);
    }, error => {
      this.alertify.error('Ошибка создания нового уровня значимости риска, ' + error);
    });
  }

  deleteSignificance(significance: Significance) {
    const initialState = {
      title: 'Удаление уровня значимости риска',
      text: 'Удалить уровень значимости риска '
        + significance.name + '?'
    };
    this.modalRef = this.modalService.show(ConfirmModalComponent, {ignoreBackdropClick: true, initialState});
    this.modalRef.content.result.subscribe((res: boolean) => {
      if (res) {
        this.refService.deleteSignificance(significance).subscribe(() => {
          this.alertify.success('Уровень значимости риска удалён');
          for (let i = 0; i < this.significances.length; i++) {
            if (+this.significances[i].id === +significance.id) {
              this.significances.splice(i, 1);
            }
          }
        }, error => {
          console.log(error);
          this.alertify.error('Ошибка удаления уровня значимости риска');
        });
      } else {
        this.alertify.message('Отмена');
      }
    });
  }
}
