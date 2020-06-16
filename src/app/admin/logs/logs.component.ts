import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {PaginatedResult, Pagination} from '../../_models/pagination';
import {ActivatedRoute} from '@angular/router';
import {AdminService} from '../../_services/admin.service';
import {AlertifyService} from '../../_services/alertify.service';
import {ConfirmModalComponent} from '../../references/confirm-modal/confirm-modal.component';
import {Log} from '../../_models/log';
import {Role} from '../../_models/role';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.css']
})
export class LogsComponent implements OnInit {
  filterForm: FormGroup;
  modalRef: BsModalRef;
  logs: Log[];
  pagination: Pagination;
  logParams: any = {};
  orderOptions: string[] = ['Дата', 'Аккаунт', 'ФИО', 'Подразделение'];
  currentOrder: string;
  isFiltered = false;
  pageLoaded = false;

  constructor(private route: ActivatedRoute,
              private fb: FormBuilder,
              private adminService: AdminService,
              private modalService: BsModalService,
              private alertify: AlertifyService) {
  }

  ngOnInit() {
    this.createFilterForm();
    this.logParams.order = 'date';
    this.logParams.orderAsc = true;
    this.currentOrder = 'Дата';
    this.route.data.subscribe(data => {
      this.logs = data['logs'].result;
      this.pagination = data['logs'].pagination;
    });
  }

  createFilterForm() {
    this.filterForm = this.fb.group({
      filterString: ['', [Validators.minLength(3), Validators.maxLength(50)]]
    });
  }

  rolesToString(roles: Role[]): string {
    let result = "";
    for (let i = 0; i < roles.length; i++) {
      if (i < roles.length - 1) {
        result += roles[i].name + ', ';
      } else {
        result += roles[i].name;
      }
    }
    return result;
  }

  pageChanged(event: any): void {
    // this.pagination.currentPage = event.page;
    if (this.pageLoaded == true) {
      return;
    }
    this.pageLoaded = true;
    this.adminService
      .getLogsPaginated(event.page, this.pagination.itemsPerPage, this.logParams)
      .subscribe((res: PaginatedResult<Log[]>) => {
          this.logs = res.result;
          this.pagination = res.pagination;
      }, error => {
        console.log(error);
        this.alertify.error('ошибка получения данных');
      }, () => {
        this.pageLoaded = false;
      });
  }

  loadLogs() {
    this.adminService
      .getLogsPaginated(this.pagination.currentPage, this.pagination.itemsPerPage, this.logParams)
      .subscribe((res: PaginatedResult<Log[]>) => {
          this.logs = res.result;
          this.pagination = res.pagination;
      }, error => {
        console.log(error);
        this.alertify.error('ошибка получения данных');
      });
  }

  sort(currentOrder: string) {
    this.currentOrder = currentOrder;
    switch (currentOrder) {
      case 'Дата':
        this.logParams.order = 'name';
        break;
      case 'Аккаунт':
        this.logParams.order = 'name';
        break;
      case 'ФИО':
        this.logParams.order = 'fullname';
        break;
      case 'Подразделение':
        this.logParams.order = 'department';
        break;
    }
    this.loadLogs();
  }

  sortOrder(order: boolean) {
    this.logParams.orderAsc = order;
    this.loadLogs();
  }

  filter() {
    const filterValue = this.filterForm.get('filterString').value;
    this.pagination.currentPage = 1;
    this.logParams.filter = filterValue;
    this.loadLogs();
    this.isFiltered = true;
  }

  unFilter() {
    this.filterForm.patchValue({filterString: ''});
    this.logParams.filter = '';
    this.loadLogs();
    this.isFiltered = false;
  }

  deleteOldLogs() {
    const initialState = {
      title: 'Удаление логов',
      text: 'Удалить логи старше года?'
    };
    this.modalRef = this.modalService.show(ConfirmModalComponent, {ignoreBackdropClick: true, initialState});
    this.modalRef.content.result.subscribe((res: boolean) => {
      if (res) {
        // this.adminService.deleteAccount(account).subscribe(() => {
        //   for (let i = 0; i < this.accounts.length; i++) {
        //     if (+this.accounts[i].id === +account.id) {
        //       this.accounts.splice(i, 1);
        //       this.alertify.success('Пользователь удалён');
        //       break;
        //     }
        //   }
        // }, error => {
        //   console.log(error);
        //   this.alertify.error('Ошибка удаления пользователя');
        // });
      } else {
        this.alertify.message('Отмена');
      }
    });
  }

}
