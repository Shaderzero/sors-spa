import {Component, OnInit} from '@angular/core';
import {Factor} from 'src/app/_models/references/factor';
import {ActivatedRoute, Router} from '@angular/router';
import {AlertifyService} from 'src/app/_services/alertify.service';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {FactorCategoryModalComponent} from '../../modals/factor-category-modal/factor-category-modal.component';
import {FactorClassModalComponent} from '../../modals/factor-class-modal/factor-class-modal.component';
import {FactorTypeModalComponent} from '../../modals/factor-type-modal/factor-type-modal.component';
import {ReferenceService} from '../../_services/reference.service';
import {ConfirmModalComponent} from '../../references/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-factor-table',
  templateUrl: './factor-table.component.html',
  styleUrls: ['./factor-table.component.css']
})
export class FactorTableComponent implements OnInit {
  factors: Factor[];
  factorTable: any[];
  modalRef: BsModalRef;

  constructor(private route: ActivatedRoute, private refService: ReferenceService,
              private alertify: AlertifyService,
              private modalService: BsModalService,
              public router: Router) {
  }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.factors = data['factors'];
    });
    this.createTableList();
  }

  reload() {
    this.refService.getFactors().subscribe(res => {
      this.factors = res;
      this.createTableList();
    });
  }

  createTableList() {
    this.factorTable = [];
    this.factors.forEach(element => {
      const factorCategory = {
        id: element.id,
        categoryId: element.id,
        code: element.code,
        category: element.name
      };
      this.factorTable.push(factorCategory);
      if (element.children) {
        element.children.forEach(child1 => {
          const child1Factor = {
            id: child1.id,
            classId: child1.id,
            categoryId: element.id,
            code: child1.code,
            category: element.name,
            class: child1.name
          };
          this.factorTable.push(child1Factor);
          if (child1.children) {
            child1.children.forEach(child2 => {
              const child2Factor = {
                id: child2.id,
                categoryId: element.id,
                classId: child1.id,
                typeId: child2.id,
                code: child2.code,
                category: element.name,
                class: child1.name,
                type: child2.name
              };
              this.factorTable.push(child2Factor);
            });
          }
        });
      }
    });
    this.factorTable.sort((a, b) => (a.code > b.code) ? 1 : ((b.code > a.code) ? -1 : 0));
  }

  newFactorCategory() {
    const initialState = {
      title: 'Создание категории',
      buttonName: 'Создать',
      factors: this.factors,
      editMode: false,
      category: {
        code: 100000,
        name: ''
      }
    };
    this.modalRef = this.modalService.show(FactorCategoryModalComponent, {initialState});
    this.modalRef.content.reload.subscribe(result => {
      if (result) {
        this.reload();
      }
    });
  }

  editFactorCategory(categoryId: number) {
    let category: Factor;
    this.factors.forEach(el => {
      if (el.id === categoryId) {
        category = el;
      }
    });
    const initialState = {
      title: 'Редактирование категории',
      buttonName: 'Сохранить',
      factors: this.factors,
      editMode: true,
      category: category
    };
    this.modalRef = this.modalService.show(FactorCategoryModalComponent, {initialState});
    this.modalRef.content.reload.subscribe(result => {
      if (result) {
        this.reload();
      }
    });
  }

  newFactorClass() {
    const initialState = {
      title: 'Создание класса',
      buttonName: 'Создать',
      editMode: false,
      factors: this.factors,
      factorClass: {
        code: 100000,
        parentId: '',
        name: ''
      }
    };
    this.modalRef = this.modalService.show(FactorClassModalComponent, {initialState});
    this.modalRef.content.reload.subscribe(result => {
      if (result) {
        this.reload();
      }
    });
  }

  editFactorClass(classId: number) {
    let factorClass: Factor;
    this.refService.getFactor(classId).subscribe((res: Factor) => {
      factorClass = res;
      const initialState = {
        title: 'Редактирование класса',
        buttonName: 'Сохранить',
        editMode: true,
        factors: this.factors,
        factorClass: factorClass
      };
      this.modalRef = this.modalService.show(FactorClassModalComponent, {initialState});
      this.modalRef.content.reload.subscribe(result => {
        if (result) {
          this.reload();
        }
      });
    });
  }

  newFactorType() {
    const initialState = {
      title: 'Создание вида',
      buttonName: 'Создать',
      editMode: false,
      factors: this.factors,
      factorType: {
        code: 100000,
        parentId: '',
        name: '',
        parent: {
          parentId: ''
        }
      }
    };
    this.modalRef = this.modalService.show(FactorTypeModalComponent, {initialState});
    this.modalRef.content.reload.subscribe(result => {
      if (result) {
        this.reload();
      }
    });
  }

  editFactorType(typeId: number) {
    let factorType: Factor;
    this.refService.getFactor(typeId).subscribe((res: Factor) => {
      factorType = res;
      const initialState = {
        title: 'Редактирование вида',
        buttonName: 'Сохранить',
        editMode: true,
        factors: this.factors,
        factorType: factorType
      };
      this.modalRef = this.modalService.show(FactorTypeModalComponent, {initialState});
      this.modalRef.content.reload.subscribe(result => {
        if (result) {
          this.reload();
        }
      });
    });
  }

  deleteFactor(factorId: number) {
    const initialState = {
      title: 'Удаление фактора риска',
      text: 'Удалить фактор риска?'
    };
    this.modalRef = this.modalService.show(ConfirmModalComponent, {ignoreBackdropClick: true, initialState});
    this.modalRef.content.result.subscribe((res: boolean) => {
      if (res) {
        this.refService.deleteFactor(factorId).subscribe(() => {
          this.alertify.success('Фактор риска удалён');
          this.reload();
        }, error => {
          console.log(error);
          this.alertify.error('Ошибка удаления фактора риска');
        });
      } else {
        this.alertify.message('Отмена');
      }
    });
  }
}
