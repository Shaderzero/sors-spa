import {Component, OnInit} from '@angular/core';
import {Department} from 'src/app/_models/department';
import {ActivatedRoute} from '@angular/router';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {AdminService} from 'src/app/_services/admin.service';
import {AlertifyService} from 'src/app/_services/alertify.service';
import {DepartmentModalComponent} from '../../modals/department-modal/department-modal.component';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {ConfirmModalComponent} from 'src/app/references/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-departments',
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.css']
})
export class DepartmentsComponent implements OnInit {
  filterForm: FormGroup;
  modalRef: BsModalRef;
  departments: Department[];
  departmentsForTable: Department[];
  orderOptions: string[] = ['Наименование', 'Код'];
  currentOrder = 'Наименование';
  order = false;
  isFiltered = false;

  constructor(private route: ActivatedRoute,
              private fb: FormBuilder,
              private adminService: AdminService,
              private modalService: BsModalService,
              private alertify: AlertifyService) {
  }

  ngOnInit() {
    this.createFilterForm();
    this.route.data.subscribe(data => {
      this.departments = data['departments'];
      this.departmentsForTable = this.departments;
    });
  }

  createFilterForm() {
    this.filterForm = this.fb.group({
      filterString: ['', [Validators.minLength(3), Validators.maxLength(20)]]
    });
  }

  filter() {
    const filterValue = this.filterForm.get('filterString').value;
    this.departmentsForTable = [];
    this.departments.forEach(element => {
      if (element.name.toLowerCase().includes(filterValue.toLowerCase())) {
        this.departmentsForTable.push(element);
      }
    });
    this.sort(this.currentOrder);
    this.isFiltered = true;
  }

  unFilter() {
    this.filterForm.patchValue({filterString: ''});
    this.departmentsForTable = this.departments;
    this.sort(this.currentOrder);
    this.isFiltered = false;
  }

  createDepartment() {
    const initialState = {
      title: 'Создание подразделения',
      buttonName: 'Создать',
      departments: this.departments,
      department: {id: null, code: 2076000000, name: '', nameAD: '', shortName: ''},
      editMode: false,
      ignoreBackdropClick: true
    };
    this.modalRef = this.modalService.show(DepartmentModalComponent, {ignoreBackdropClick: true, initialState});
    this.modalRef.content.reload.subscribe((res: Department) => {
      if (res) {
        this.departments.push(res);
      }
    });
  }

  sort(currentOrder: string) {
    this.currentOrder = currentOrder;
    switch (currentOrder) {
      case 'Код':
        this.sortTable('code');
        break;
      case 'Наименование':
        this.sortTable('name');
        break;
    }
  }

  sortOrder(order: boolean) {
    this.order = order;
    this.sort(this.currentOrder);
  }

  sortTable(param) {
    if (this.order) {
      this.departmentsForTable.sort((a, b) => (a[param] > b[param]) ? 1 : ((b[param] > a[param]) ? -1 : 0));
    } else {
      this.departmentsForTable.sort((b, a) => (a[param] > b[param]) ? 1 : ((b[param] > a[param]) ? -1 : 0));
    }
  }

  editDepartment(department: Department) {
    const initialState = {
      title: 'Редактирование подразделения',
      buttonName: 'Изменить',
      departments: this.departments,
      department: department,
      editMode: true
    };
    this.modalRef = this.modalService.show(DepartmentModalComponent, {initialState});
    this.modalRef.content.reload.subscribe((res: Department) => {
      if (res) {
        for (let i = 0; i < this.departments.length; i++) {
          if (+this.departments[i].id === +res.id) {
            this.departments[i] = res;
            break;
          }
        }
      }
    });
  }

  deleteDepartment(department: Department) {
    const initialState = {
      title: 'Удаление подразделения',
      text: 'Удалить подразделение (' +
        department.code + ')' + department.name + '?'
    };
    this.modalRef = this.modalService.show(ConfirmModalComponent, {ignoreBackdropClick: true, initialState});
    this.modalRef.content.result.subscribe((res: boolean) => {
      if (res) {
        this.adminService.deleteDepartment(department).subscribe(() => {
          for (let i = 0; i < this.departments.length; i++) {
            if (+this.departments[i].id === +department.id) {
              this.departments.splice(i, 1);
              this.departmentsForTable = this.departments;
              this.alertify.success('Подразделение удалено');
              break;
            }
          }
        }, error => {
          console.log(error);
          this.alertify.error('Ошибка удаления подразделения');
        });
      } else {
        this.alertify.message('Отмена');
      }
    });
  }
}
