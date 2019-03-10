import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {BsModalRef} from 'ngx-bootstrap';
import {AlertifyService} from 'src/app/_services/alertify.service';
import {Factor} from 'src/app/_models/references/factor';
import {ReferenceService} from '../../_services/reference.service';

@Component({
  selector: 'app-factor-class-modal',
  templateUrl: './factor-class-modal.component.html',
  styleUrls: ['./factor-class-modal.component.css']
})
export class FactorClassModalComponent implements OnInit {
  classForm: FormGroup;
  title: string;
  buttonName: string;
  editMode: boolean;
  categories: Factor[] = [];
  factors: Factor[];
  factorClass: Factor;
  @Output() reload = new EventEmitter();

  constructor(public modalRef: BsModalRef, private fb: FormBuilder,
              private refService: ReferenceService, private alertify: AlertifyService) {
  }

  ngOnInit() {
    this.getCategories();
    this.createClassForm();
  }

  getCategories() {
    this.factors.forEach(element => {
      if (!element.parent) {
        this.categories.push(element);
      }
    });
  }

  createClassForm() {
    this.classForm = this.fb.group({
      code: [this.factorClass.code, [Validators.required, Validators.min(100000), Validators.max(999999)]],
      parentId: [this.factorClass.parentId, Validators.required],
      name: [this.factorClass.name, [Validators.required, Validators.maxLength(200)]]
    });
  }

  ok() {
    if (this.editMode) {
      const id = this.factorClass.id;
      this.factorClass = Object.assign({}, this.classForm.value);
      this.factorClass.id = id;
      if (this.checkUniqie()) {
        this.updateClass();
        this.modalRef.hide();
      }
    } else {
      this.factorClass = Object.assign({}, this.classForm.value);
      if (this.checkUniqie()) {
        this.createClass();
        this.modalRef.hide();
      }
    }
  }

  checkUniqie() {
    for (let i = 0; i < this.factors.length; i++) {
      const fcat = this.factors[i];
      if (+this.factorClass.code === +fcat.code) {
        this.alertify.error('Данный код уже используется для фактора (' + fcat.code + ') ' + fcat.name);
        return false;
      }
      if (fcat.children) {
        for (let ii = 0; ii < fcat.children.length; ii++) {
          const fclass = fcat.children[ii];
          if (+this.factorClass.code === +fclass.code && this.factorClass.id !== fclass.id) {
            this.alertify.error('Данный код уже используется для фактора (' + fclass.code + ') ' + fclass.name);
            return false;
          }
          if (this.factorClass.name === fclass.name && this.factorClass.id !== fclass.id && this.factorClass.parentId === fclass.parentId) {
            this.alertify.error('Данное наименование уже используется для фактора (' + fclass.code + ') ' + fclass.name);
            return false;
          }
          if (fclass.children) {
            for (let iii = 0; iii < fclass.children.length; iii++) {
              const ftype = fclass.children[iii];
              if (+this.factorClass.code === +ftype.code) {
                this.alertify.error('Данный код уже используется для фактора (' + ftype.code + ') ' + ftype.name);
                return false;
              }
            }
          }
        }
      }
    }
    return true;
  }

  createClass() {
    this.refService.createFactor(this.factorClass).subscribe((factor: Factor) => {
      this.reload.emit(factor);
      this.alertify.success('Класс успешно создан');
    }, error => {
      this.alertify.error('ошибка создания класса' + '\n' + error);
    });
  }

  updateClass() {
    this.refService.updateFactor(this.factorClass).subscribe((factor: Factor) => {
      this.reload.emit(factor);
      this.alertify.success('Класс успешно обновлен');
    }, error => {
      this.alertify.error('ошибка обновления класса' + '\n' + error);
    });
  }

  onChangeCategory(categoryId) {
    for (let i = 0; i < this.categories.length; i++) {
      if (this.categories[i].id === categoryId) {
        this.classForm.patchValue({code: this.categories[i].code});
      }
    }
  }

}
