import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {Account} from 'src/app/_models/account';
import {ActivatedRoute} from '@angular/router';
import {AdminService} from 'src/app/_services/admin.service';
import {AlertifyService} from 'src/app/_services/alertify.service';
import {AccountModalComponent} from '../../modals/account-modal/account-modal.component';
import {ConfirmModalComponent} from 'src/app/references/confirm-modal/confirm-modal.component';
import {PaginatedResult, Pagination} from '../../_models/pagination';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css']
})
export class AccountsComponent implements OnInit {
  filterForm: FormGroup;
  modalRef: BsModalRef;
  accounts: Account[];
  pagination: Pagination;
  accParams: any = {};
  orderOptions: string[] = ['Аккаунт', 'ФИО', 'Подразделение'];
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
    this.accParams.order = 'name';
    this.accParams.orderAsc = true;
    this.currentOrder = 'Аккаунт';
    this.route.data.subscribe(data => {
      this.accounts = data['accounts'].result;
      this.pagination = data['accounts'].pagination;
    });
  }

  createFilterForm() {
    this.filterForm = this.fb.group({
      filterString: ['', [Validators.minLength(3), Validators.maxLength(20)]]
    });
  }

  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadAccs();
  }

  loadAccs() {
    this.adminService
      .getAccountsPaginated(this.pagination.currentPage, this.pagination.itemsPerPage, this.accParams)
      .subscribe((res: PaginatedResult<Account[]>) => {
        this.accounts = res.result;
        this.pagination = res.pagination;
      }, error => {
        console.log(error);
        this.alertify.error('ошибка получения данных');
      });
  }

  sort(currentOrder: string) {
    this.currentOrder = currentOrder;
    switch (currentOrder) {
      case 'Аккаунт':
        this.accParams.order = 'name';
        break;
      case 'ФИО':
        this.accParams.order = 'fullname';
        break;
      case 'Подразделение':
        this.accParams.order = 'department';
        break;
    }
    this.loadAccs();
  }

  sortOrder(order: boolean) {
    this.accParams.orderAsc = order;
    this.loadAccs();
  }

  filter() {
    const filterValue = this.filterForm.get('filterString').value;
    this.pagination.currentPage = 1;
    this.accParams.filter = filterValue;
    this.loadAccs();
    this.isFiltered = true;
  }

  unFilter() {
    this.filterForm.patchValue({filterString: ''});
    this.accParams.filter = '';
    this.loadAccs();
    this.isFiltered = false;
  }

  createAccount() {
    const initialState = {
      title: 'Создание пользователя',
      buttonName: 'Создать',
      users: this.accounts,
      user: {id: null, name: '', fullname: '', email: '', department: {name: ''}},
      editMode: false
    };
    this.modalRef = this.modalService.show(AccountModalComponent, {ignoreBackdropClick: true, initialState});
    this.modalRef.content.reload.subscribe((res: Account) => {
      if (res) {
        this.accounts.push(res);
      }
    });
  }

  editAccount(account: Account) {
    const initialState = {
      title: 'Редактирование пользователя',
      buttonName: 'Изменить',
      accounts: this.accounts,
      account: account,
      editMode: true
    };
    this.modalRef = this.modalService.show(AccountModalComponent, {initialState});
    this.modalRef.content.reload.subscribe((res: Account) => {
      if (res) {
        for (let i = 0; i < this.accounts.length; i++) {
          if (+this.accounts[i].id === +res.id) {
            this.accounts[i] = res;
            break;
          }
        }
      }
    });
  }

  deleteAccount(account: Account) {
    const initialState = {
      title: 'Удалить пользователя?',
      text: 'Удаление пользователя: ' + account.fullname
    };
    this.modalRef = this.modalService.show(ConfirmModalComponent, {ignoreBackdropClick: true, initialState});
    this.modalRef.content.result.subscribe((res: boolean) => {
      if (res) {
        this.adminService.deleteAccount(account).subscribe(() => {
          for (let i = 0; i < this.accounts.length; i++) {
            if (+this.accounts[i].id === +account.id) {
              this.accounts.splice(i, 1);
              this.alertify.success('Пользователь удалён');
              break;
            }
          }
        }, error => {
          console.log(error);
          this.alertify.error('Ошибка удаления пользователя');
        });
      } else {
        this.alertify.message('Отмена');
      }
    });
  }
}
