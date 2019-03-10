import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Factor} from 'src/app/_models/references/factor';
import {BsModalRef} from 'ngx-bootstrap';
import {AlertifyService} from 'src/app/_services/alertify.service';
import {ReferenceService} from '../../_services/reference.service';

@Component({
  selector: 'app-factor-type-modal',
  templateUrl: './factor-type-modal.component.html',
  styleUrls: ['./factor-type-modal.component.css']
})
export class FactorTypeModalComponent implements OnInit {
  typeForm: FormGroup;
  buttonName: string;
  editMode: boolean;
  factors: Factor[];
  categories: Factor[] = [];
  classes: Factor[] = [];
  factorType: Factor;
  @Output() reload = new EventEmitter();

  constructor(public modalRef: BsModalRef, private fb: FormBuilder,
              private refService: ReferenceService, private alertify: AlertifyService) {
  }

  ngOnInit() {
    this.fillCategories();
    if (this.editMode) {
      this.patchClasses(this.factorType.parent.parentId);
    }
    this.createTypeForm();
  }

  fillCategories() {
    for (let i = 0; i < this.factors.length; i++) {
      if (this.factors[i].parent === null) {
        this.categories.push(this.factors[i]);
      }
    }
  }

  patchCode(classId) {
    for (let i = 0; i < this.classes.length; i++) {
      if (this.classes[i].id === classId) {
        this.typeForm.patchValue({code: this.classes[i].code});
        break;
      }
    }
  }

  patchClasses(categoryId) {
    this.classes.length = 0;
    for (let i = 0; i < this.categories.length; i++) {
      if (this.categories[i].id === categoryId
        && this.categories[i].children) {
        this.categories[i].children.forEach(el => {
          this.classes.push(el);
        });
        break;
      }
    }
  }

  createTypeForm() {
    this.typeForm = this.fb.group({
      code: [this.factorType.code, [Validators.required, Validators.min(100000), Validators.max(999999)]],
      categoryId: [this.factorType.parent.parentId, Validators.required],
      parentId: [this.factorType.parentId, Validators.required],
      name: [this.factorType.name, [Validators.required, Validators.maxLength(200)]]
    });
  }

  ok() {
    if (this.editMode) {
      const id = this.factorType.id;
      this.factorType = Object.assign({}, this.typeForm.value);
      this.factorType.id = id;
      if (this.checkUniqie()) {
        this.updateType();
        this.modalRef.hide();
      }
    } else {
      this.factorType = Object.assign({}, this.typeForm.value);
      if (this.checkUniqie()) {
        this.createType();
        this.modalRef.hide();
      }
    }
  }

  checkUniqie() {
    for (let i = 0; i < this.factors.length; i++) {
      const fcat = this.factors[i];
      if (+this.factorType.code === +fcat.code) {
        this.alertify.error('Данный код уже используется для фактора (' + fcat.code + ') ' + fcat.name);
        return false;
      }
      if (fcat.children) {
        for (let ii = 0; ii < fcat.children.length; ii++) {
          const fclass = fcat.children[ii];
          if (+this.factorType.code === +fclass.code) {
            this.alertify.error('Данный код уже используется для фактора (' + fclass.code + ') ' + fclass.name);
            return false;
          }
          if (fclass.children) {
            for (let iii = 0; iii < fclass.children.length; iii++) {
              const ftype = fclass.children[iii];
              if (+this.factorType.code === +ftype.code && this.factorType.id !== ftype.id) {
                this.alertify.error('Данный код уже используется для фактора (' + ftype.code + ') ' + ftype.name);
                return false;
              }
              if (this.factorType.name === ftype.name && this.factorType.id !== ftype.id && this.factorType.parentId === ftype.parentId) {
                this.alertify.error('Данное наименование уже используется для фактора (' + ftype.code + ') ' + ftype.name);
                return false;
              }
            }
          }
        }
      }
    }
    return true;
  }

  createType() {
    this.refService.createFactor(this.factorType).subscribe((factor: Factor) => {
      this.alertify.success('Вид успешно создан');
      this.reload.emit(factor);
    }, error => {
      this.alertify.error('ошибка создания вида' + '\n' + error);
    });
  }

  updateType() {
    this.refService.updateFactor(this.factorType).subscribe((factor: Factor) => {
      this.alertify.success('Вид успешно обновлен');
      this.reload.emit(factor);
    }, error => {
      this.alertify.error('ошибка обновления вида' + '\n' + error);
    });
  }

}
