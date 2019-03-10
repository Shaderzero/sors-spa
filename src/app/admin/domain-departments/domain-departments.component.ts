import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {Department} from 'src/app/_models/department';
import {DomainDepartment} from 'src/app/_models/domainDepartment';
import {ActivatedRoute} from '@angular/router';
import {AdminService} from 'src/app/_services/admin.service';
import {AlertifyService} from 'src/app/_services/alertify.service';
import {DomainDepartmentModalComponent} from '../../modals/domain-department-modal/domain-department-modal.component';
import {DomainUser} from 'src/app/_models/domainUser';
import {ConfirmModalComponent} from 'src/app/references/confirm-modal/confirm-modal.component';
import {PaginatedResult, Pagination} from '../../_models/pagination';

@Component({
  selector: 'app-domain-departments',
  templateUrl: './domain-departments.component.html',
  styleUrls: ['./domain-departments.component.css']
})
export class DomainDepartmentsComponent implements OnInit {
  filterForm: FormGroup;
  modalRef: BsModalRef;
  domainUsers: DomainUser[];
  departments: Department[];
  domainDepartments: DomainDepartment[];
  pagination: Pagination;
  depParams: any = {};
  orderOptions: string[] = ['Наименование AD', 'Наименование DB'];
  currentOrder: string;
  isFiltered = false;

  constructor(private route: ActivatedRoute,
              private fb: FormBuilder,
              private adminService: AdminService,
              private modalService: BsModalService,
              private alertify: AlertifyService) {
  }

  ngOnInit() {
    this.createFilterForm();
    this.depParams.order = 'adName';
    this.depParams.orderAsc = true;
    this.currentOrder = 'Наименование AD';
    this.route.data.subscribe(data => {
      this.domainDepartments = data['domaindepartments'].result;
      this.pagination = data['domaindepartments'].pagination;
      this.departments = data['departments'];
      this.domainUsers = data['domainusers'];
    });
  }

  createFilterForm() {
    this.filterForm = this.fb.group({
      filterString: ['', [Validators.minLength(3), Validators.maxLength(100)]]
    });
  }

  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadDeps();
  }

  loadDeps() {
    this.adminService
      .getDomainDepartmentsPage(this.pagination.currentPage, this.pagination.itemsPerPage, this.depParams)
      .subscribe((res: PaginatedResult<DomainDepartment[]>) => {
        this.domainDepartments = res.result;
        this.pagination = res.pagination;
      }, error => {
        console.log(error);
        this.alertify.error('ошибка получения данных');
      });
  }

  sort(currentOrder: string) {
    this.currentOrder = currentOrder;
    switch (currentOrder) {
      case 'Наименование AD':
        this.depParams.order = 'adName';
        break;
      case 'Наименование DB':
        this.depParams.order = 'dbName';
        break;
    }
    this.loadDeps();
  }

  sortOrder(order: boolean) {
    this.depParams.orderAsc = order;
    this.loadDeps();
  }

  filter() {
    const filterValue = this.filterForm.get('filterString').value;
    this.pagination.currentPage = 1;
    this.depParams.filter = filterValue;
    this.loadDeps();
    this.isFiltered = true;
  }

  unFilter() {
    this.filterForm.patchValue({filterString: ''});
    this.depParams.filter = '';
    this.loadDeps();
    this.isFiltered = false;
  }

  createDomainDepartment() {
    const initialState = {
      title: 'Создание подразделения',
      buttonName: 'Создать',
      domainUsers: this.domainUsers,
      departments: this.departments,
      domainDepartments: this.domainDepartments,
      domainDepartment: {id: null, name: '', department: {name: ''}},
      editMode: false
    };
    this.modalRef = this.modalService.show(DomainDepartmentModalComponent, {ignoreBackdropClick: true, initialState});
    this.modalRef.content.reload.subscribe((res: DomainDepartment) => {
      if (res) {
        this.domainDepartments.push(res);
      }
    });
  }

  editDomainDepartment(domainDepartment: DomainDepartment) {
    const initialState = {
      title: 'Редактирование подразделения',
      buttonName: 'Изменить',
      domainUsers: this.domainUsers,
      departments: this.departments,
      domainDepartments: this.domainDepartments,
      domainDepartment: domainDepartment,
      editMode: true
    };
    this.modalRef = this.modalService.show(DomainDepartmentModalComponent, {ignoreBackdropClick: true, initialState});
    this.modalRef.content.reload.subscribe((res: DomainDepartment) => {
      if (res) {
        for (let i = 0; i < this.domainDepartments.length; i++) {
          if (+this.domainDepartments[i].id === +res.id) {
            this.domainDepartments[i] = res;
            break;
          }
        }
      }
    });
  }

  deleteDomainDepartment(domainDepartment: DomainDepartment) {
    const initialState = {
      title: 'Удаление подразделения',
      text: 'Удалить подразделение ' +
        domainDepartment.name + '?'
    };
    this.modalRef = this.modalService.show(ConfirmModalComponent, {ignoreBackdropClick: true, initialState});
    this.modalRef.content.result.subscribe((res: boolean) => {
      if (res) {
        this.adminService.deleteDomainDepartment(domainDepartment).subscribe(() => {
          for (let i = 0; i < this.domainDepartments.length; i++) {
            if (+this.domainDepartments[i].id === +domainDepartment.id) {
              this.domainDepartments.splice(i, 1);
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
