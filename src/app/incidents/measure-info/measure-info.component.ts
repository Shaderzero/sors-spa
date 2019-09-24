import {Component, Input, OnInit} from '@angular/core';
import {Measure} from 'src/app/_models/measure';
import {AlertifyService} from 'src/app/_services/alertify.service';
import {Responsible} from 'src/app/_models/responsible';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {MeasureNewModalComponent} from '../measure-new-modal/measure-new-modal.component';
import {MeasureService} from 'src/app/_services/measure.service';
import {ConfirmModalComponent} from 'src/app/references/confirm-modal/confirm-modal.component';
import {Account} from 'src/app/_models/account';
import {AuthService} from 'src/app/_services/auth.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ConfirmCommentModalComponent} from '../../references/confirm-comment-modal/confirm-comment-modal.component';

@Component({
  selector: 'app-measure-info',
  templateUrl: './measure-info.component.html',
  styleUrls: ['./measure-info.component.css']
})
export class MeasureInfoComponent implements OnInit {
  @Input() responsible: Responsible;
  @Input() status: string;
  filterForm: FormGroup;
  currentUser: Account;
  modalRef: BsModalRef;
  measures: Measure[];
  measureParams: any = {};
  orderOptions: string[] = ['Дата', 'Описание', 'Результат', 'Срок', 'Статус'];
  currentOrder: string;
  isFiltered = false;

  constructor(private measureService: MeasureService,
              private fb: FormBuilder,
              private authService: AuthService,
              private alertify: AlertifyService,
              private modalService: BsModalService) {
  }

  ngOnInit() {
    this.measureParams.order = 'dateCreate';
    this.measureParams.orderAsc = true;
    this.currentOrder = 'Дата';
    this.loadMeasures();
    this.createFilterForm();
  }

  isRiskCoordinator() {
    return this.authService.isRiskCoordinator(this.responsible.department);
  }

  canEdit() {
    if (status === 'close') {
      return false;
    }
    const users = this.responsible.accounts;
    let result = false;
    if (users) {
      for (let i = 0; i < users.length; i++) {
        if (+users[i].id === +this.authService.currentUser.id) {
          result = true;
          break;
        }
      }
    }
    return result;
  }

  canSign() {
    if (status === 'close') {
      return false;
    }
    const department = this.responsible.department;
    return this.authService.isRiskCoordinator(department);
  }

  loadMeasures() {
    this.measureService.getMeasures(this.responsible.id, this.measureParams).subscribe((res: Measure[]) => {
      this.measures = res;
    }, error => {
      this.alertify.error(error);
    });
  }

  sort(currentOrder: string) {
    this.currentOrder = currentOrder;
    switch (currentOrder) {
      case 'Дата':
        this.measureParams.order = 'dateCreate';
        break;
      case 'Описание':
        this.measureParams.order = 'description';
        break;
      case 'Результат':
        this.measureParams.order = 'expectedResult';
        break;
      case 'Срок':
        this.measureParams.order = 'deadLine';
        break;
      case 'Статус':
        this.measureParams.order = 'status';
        break;
    }
    this.loadMeasures();
  }

  sortOrder(order: boolean) {
    this.measureParams.orderAsc = order;
    this.loadMeasures();
  }

  createFilterForm() {
    this.filterForm = this.fb.group({
      filterString: ['', [Validators.minLength(3), Validators.maxLength(50)]]
    });
  }

  filter() {
    const filterValue = this.filterForm.get('filterString').value;
    this.measureParams = {};
    this.measureParams.filter = filterValue;
    this.loadMeasures();
    this.isFiltered = true;
  }

  unFilter() {
    this.filterForm.patchValue({filterString: ''});
    this.measureParams = {};
    this.loadMeasures();
    this.isFiltered = false;
  }

  createMeasureModal() {
    const initialState = {
      title: 'Создание мероприятия',
      buttonName: 'Создать',
      measures: this.measures,
      measure: {
        id: 0,
        description: '',
        expectedResult: '',
        deadLine: new Date(),
        deadLineString: '',
        status: 'check',
        responsibleId: this.responsible.id
      }
    };
    this.modalRef = this.modalService.show(MeasureNewModalComponent, {ignoreBackdropClick: true, initialState});
    this.modalRef.content.outputMeasure.subscribe((res: Measure) => {
      if (res) {
        this.createMeasure(res);
      }
    });
  }

  createMeasure(measure: Measure) {
    const initialState = {
      title: 'Создать новое мероприятие?',
      text: 'Описание: ' + measure.description
    };
    this.modalRef = this.modalService.show(ConfirmModalComponent, {ignoreBackdropClick: true, initialState});
    this.modalRef.content.result.subscribe((res) => {
      if (res) {
        if (measure.deadLine) {
          measure.deadLine = new Date(measure.deadLine.setHours(measure.deadLine.getHours() + 12));
        }
        measure.authorId = this.authService.currentUser.id;
        this.measureService.createMeasure(measure).subscribe((newMeasure: Measure) => {
          this.measures.push(newMeasure);
          console.log(newMeasure);
          this.alertify.success('Создано новое мероприятие');
        }, error => {
          console.log(error);
          this.alertify.error('ошибка создания мероприятия');
        });
      }
    });
  }

  editMeasureModal(measure: Measure) {
    const initialState = {
      title: 'Редактирование мероприятия',
      buttonName: 'Сохранить',
      measures: this.measures,
      measure: measure
    };
    this.modalRef = this.modalService.show(MeasureNewModalComponent, {ignoreBackdropClick: true, initialState});
    this.modalRef.content.outputMeasure.subscribe((res: Measure) => {
      if (res) {
        this.editMeasure(res);
      }
    });
  }

  editMeasure(measure: Measure) {
    const initialState = {
      title: 'Сохранить изменения в мероприятии?',
      text: 'Описание: ' + measure.description
    };
    this.modalRef = this.modalService.show(ConfirmCommentModalComponent, {ignoreBackdropClick: true, initialState});
    this.modalRef.content.outputComment.subscribe((comment: string) => {
      if (measure.deadLine) {
        measure.deadLine = new Date(measure.deadLine.setHours(measure.deadLine.getHours() + 12));
      }
      measure.comment = comment;
      measure.authorId = this.authService.currentUser.id;
      this.measureService.updateMeasure(measure).subscribe((updatedMeasure: Measure) => {
        for (let i = 0; i < this.measures.length; i++) {
          if (+this.measures[i].id === +updatedMeasure.id) {
            this.measures[i] = updatedMeasure;
            this.alertify.success('Мероприятие обновлено');
            break;
          }
        }
      }, error => {
        this.alertify.error(error);
      });
    });
  }

  removeMeasure(measure: Measure) {
    const initialState = {
      title: 'Удалить мероприятие?',
      text: 'Описание: ' + measure.description
    };
    this.modalRef = this.modalService.show(ConfirmModalComponent, {ignoreBackdropClick: true, initialState});
    this.modalRef.content.result.subscribe((res) => {
      if (res) {
        this.measureService.deleteMeasure(+measure.id).subscribe(() => {
          for (let i = 0; i < this.measures.length; i++) {
            if (+this.measures[i].id === +measure.id) {
              this.measures.splice(i, 1);
              this.alertify.success('Мероприятие удалено');
            }
          }
        }, error => {
          console.log(error);
          this.alertify.error('ошибка удаления мероприятия');
        });
      }
    });
  }

  sign(measure: Measure) {
    const patcher = [
      {
        'propertyName': 'Status',
        'propertyValue': 'sign'
      }
    ];
    this.measureService.signMeasure(measure.id, patcher).subscribe(() => {
      this.alertify.success('Мероприятие подписано');
      measure.status = 'sign';
    }, error => {
      console.log(error);
      this.alertify.error('ошибка согласования мероприятия');
    });
  }

  unSign(measure: Measure) {
    const patcher = [
      {
        'propertyName': 'Status',
        'propertyValue': 'check'
      }
    ];
    this.measureService.signMeasure(measure.id, patcher).subscribe(() => {
      this.alertify.success('Мероприятие отозвано');
      measure.status = 'check';
    }, error => {
      console.log(error);
      this.alertify.error('ошибка отзыва мероприятия');
    });
  }
}
