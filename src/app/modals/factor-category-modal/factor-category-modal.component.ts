import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {BsModalRef} from 'ngx-bootstrap';
import {Factor} from 'src/app/_models/references/factor';
import {AlertifyService} from 'src/app/_services/alertify.service';
import {ReferenceService} from '../../_services/reference.service';

@Component({
  selector: 'app-factor-category-modal',
  templateUrl: './factor-category-modal.component.html',
  styleUrls: ['./factor-category-modal.component.css']
})
export class FactorCategoryModalComponent implements OnInit {
  categoryForm: FormGroup;
  title: string;
  buttonName: string;
  editMode: boolean;
  category: Factor;
  factors: Factor[];
  @Output() reload = new EventEmitter();

  constructor(public modalRef: BsModalRef, private fb: FormBuilder,
              private refService: ReferenceService, private alertify: AlertifyService) {
  }

  ngOnInit() {
    this.createCategoryForm();
  }

  createCategoryForm() {
    this.categoryForm = this.fb.group({
      code: [this.category.code, [Validators.required, Validators.min(0), Validators.max(999999)]],
      name: [this.category.name, [Validators.required, Validators.maxLength(200)]]
    });
  }

  ok() {
    if (this.editMode) {
      const id = this.category.id;
      this.category = Object.assign({}, this.categoryForm.value);
      this.category.id = id;
      if (this.checkUniqie()) {
        this.updateCategory();
        this.modalRef.hide();
      }
    } else {
      this.category = Object.assign({}, this.categoryForm.value);
      if (this.checkUniqie()) {
        this.createCategory();
        this.modalRef.hide();
      }
    }
  }

  checkUniqie() {
    for (let i = 0; i < this.factors.length; i++) {
      const fcat = this.factors[i];
      if (+this.category.code === +fcat.code && this.category.id !== fcat.id) {
        this.alertify.error('Данный код уже используется для фактора (' + fcat.code + ') ' + fcat.name);
        return false;
      }
      if (this.category.name === fcat.name && this.category.id !== fcat.id) {
        this.alertify.error('Данное наименование уже используется для фактора (' + fcat.code + ') ' + fcat.name);
        return false;
      }
      if (fcat.children) {
        for (let ii = 0; ii < fcat.children.length; ii++) {
          const fclass = fcat.children[ii];
          if (+this.category.code === +fclass.code) {
            this.alertify.error('Данный код уже используется для фактора (' + fclass.code + ') ' + fclass.name);
            return false;
          }
          if (fclass.children) {
            for (let iii = 0; iii < fclass.children.length; iii++) {
              const ftype = fclass.children[iii];
              if (+this.category.code === +ftype.code) {
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

  createCategory() {
    this.refService.createFactor(this.category).subscribe((factor: Factor) => {
      this.reload.emit(true);
      this.alertify.success('Категория успешно создана');
    }, error => {
      this.alertify.error('ошибка создания категории' + '\n' + error);
    });
  }

  updateCategory() {
    this.refService.updateFactor(this.category).subscribe((factor: Factor) => {
      this.reload.emit(true);
      this.alertify.success('Категория успешно обновлена');
    }, error => {
      this.alertify.error('ошибка обновления категории' + '\n' + error);
    });
  }

}
