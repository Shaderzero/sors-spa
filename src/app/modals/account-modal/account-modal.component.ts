import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Department } from 'src/app/_models/department';
import { Account } from 'src/app/_models/account';
import { BsModalRef, TypeaheadMatch } from 'ngx-bootstrap';
import { AdminService } from 'src/app/_services/admin.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { Role } from 'src/app/_models/role';

@Component({
  selector: 'app-account-modal',
  templateUrl: './account-modal.component.html',
  styleUrls: ['./account-modal.component.css']
})
export class AccountModalComponent implements OnInit {
  modalForm: FormGroup;
  title: string;
  buttonName: string;
  editMode: boolean;
  account: Account;
  accounts: Account[];
  roles: Role[];
  department: Department;
  departments: Department[];
  @Output() reload = new EventEmitter();

  constructor(public modalRef: BsModalRef, private fb: FormBuilder,
    private adminService: AdminService, private alertify: AlertifyService) { }

  ngOnInit() {
    this.getDepartments();
    this.getRoles();
    this.createModalForm();
  }

  getDepartments() {
    this.adminService.getDepartments().subscribe((res: Department[]) => {
      this.departments = res;
    }, error => {
      console.log(error);
      this.alertify.error('Не удалось получить список подразделений');
    });
  }

  getRoles() {
    this.adminService.getAccountRoles().subscribe((res: Role[]) => {
      this.roles = res;
      this.selectRoles();
    }, error => {
      console.log(error);
      this.alertify.error('Не удалось получить список пользовательских ролей');
    });
  }

  createModalForm() {
    this.modalForm = this.fb.group({
      name: [this.account.name, [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      fullname: [this.account.fullname, [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      email: [this.account.email, [Validators.required, Validators.email]],
      department: [this.account.department.name, [Validators.required]]});
  }

  onSelectDepartment(event: TypeaheadMatch): void {
    this.account.department = event.item;
  }

  selectRoles() {
    if (this.account.accountRoles) {
      for (let i = 0; i < this.account.accountRoles.length; i++) {
        for (let ii = 0; ii < this.roles.length; ii++) {
          if (+this.account.accountRoles[i].id === +this.roles[ii].id) {
            this.roles[ii].checked = true;
            break;
          }
        }
      }
    }
  }

  ok() {
    this.account.name = this.modalForm.get('name').value;
    this.account.fullname = this.modalForm.get('fullname').value;
    this.account.email = this.modalForm.get('email').value;
    this.account.accountRoles = [];
    for (let i = 0; i < this.roles.length; i++) {
      if (this.roles[i].checked) {
        this.account.accountRoles.push(this.roles[i]);
      }
    }
    if (this.editMode) {
      if (this.checkUniqie()) {
        this.updateAccount();
        this.modalRef.hide();
      }
    } else {
      if (this.checkUniqie()) {
        this.createAccount();
        this.modalRef.hide();
      }
    }
  }

  checkUniqie() {
    if (this.accounts === null) {
      return true;
    } else {
      for (let i = 0; i < this.accounts.length; i++) {
        const u = this.accounts[i];
        if (this.account.name === u.name && this.account.id !== u.id) {
          this.alertify.error('Данный аккаунт уже используется для пользователя (' + u.name + ') ' + u.fullname);
          return false;
        }
        if (this.account.email === u.email && this.account.id !== u.id) {
          this.alertify.error('Данный почтовый адрес уже используется для пользователя (' + u.name + ') ' + u.fullname);
          return false;
        }
      }
      return true;
    }
  }

  createAccount() {
    this.adminService.createAccount(this.account).subscribe((user: Account) => {
      this.reload.emit(user);
      this.alertify.success('Пользователь успешно создан');
    }, error => {
      console.log(error);
      this.alertify.error('Ошибка создания пользователя');
    });
  }

  updateAccount() {
    this.adminService.updateAccount(this.account).subscribe((user: Account) => {
      this.reload.emit(user);
      this.alertify.success('Пользователь успешно обновлён');
    }, error => {
      console.log(error);
      this.alertify.error('Ошибка обновления пользователя');
    });
  }
}
