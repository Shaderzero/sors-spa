import {Component, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {DomainUser} from 'src/app/_models/domainUser';
import {ActivatedRoute, ActivatedRouteSnapshot, Router} from '@angular/router';
import {AdminService} from 'src/app/_services/admin.service';
import {AlertifyService} from 'src/app/_services/alertify.service';
import {Account} from 'src/app/_models/account';
import {Department} from 'src/app/_models/department';
import {DomainDepartment} from 'src/app/_models/domainDepartment';
import {LoaderService} from '../../_helpers/loader/loader.service';

@Component({
  selector: 'app-user-domain-merge',
  templateUrl: './user-domain-merge.component.html',
  styleUrls: ['./user-domain-merge.component.css']
})
export class UserDomainMergeComponent implements OnInit {
  filterNewForm: FormGroup;
  filterChangedForm: FormGroup;
  modalRef: BsModalRef;
  accounts: Account[];
  domainUsers: DomainUser[];
  newUsers: DomainUser[] = [];
  changedUsers: DomainUser[] = [];
  newUsersForTable: DomainUser[];
  changedUsersForTable: DomainUser[];
  departments: Department[];
  domainDepartments: DomainDepartment[];
  isNewFiltered = false;
  isChangedFiltered = false;

  constructor(private route: ActivatedRoute,
              private fb: FormBuilder,
              private adminService: AdminService,
              private router: Router,
              private alertify: AlertifyService) {
  }

  ngOnInit() {
    this.createFilterForm();
    this.route.data.subscribe(data => {
      this.domainUsers = data['domainusers'];
      this.accounts = data['accounts'];
      this.departments = data['departments'];
      this.domainDepartments = data['domaindepartments'];
      this.fillArrays();
    });
  }

  selectAllUsers(users: DomainUser[]) {
    for (let i = 0; i < users.length; i++) {
      users[i].checked = true;
    }
  }

  checkedCount(users: DomainUser[]) {
    let result = false;
    for (let i = 0; i < users.length; i++) {
      if (users[i].checked) {
        result = true;
        break;
      }
    }
    return result;
  }

  updateAccounts(users: DomainUser[]) {
    const accountsForUpdate: Account[] = [];
    for (let i = 0; i < users.length; i++) {
      const newUser = users[i];
      if (newUser.checked) {
        for (let ii = 0; ii < this.accounts.length; ii++) {
          const updatedAccount = this.accounts[ii];
          if (newUser.name === updatedAccount.name) {
            updatedAccount.fullname = newUser.fullname;
            updatedAccount.email = newUser.email;
            for (let iii = 0; iii < this.domainDepartments.length; iii++) {
              if (this.domainDepartments[iii].name === newUser.domainDepartment) {
                updatedAccount.department = this.domainDepartments[iii].department;
                break;
              }
            }
            accountsForUpdate.push(updatedAccount);
            break;
          }
        }
      }
    }
    this.adminService.updateAccounts(accountsForUpdate).subscribe(() => {
      this.alertify.success('Пользователи успешно обновлены');
      this.router.navigate(['/admin/accounts']);
    }, error => {
      console.log(error);
      this.alertify.error('ошибка обновления пользователей');
    });
  }

  addAccounts(users: DomainUser[]) {
    const accountsForCreate: Account[] = [];
    for (let i = 0; i < users.length; i++) {
      const newUser = users[i];
      if (newUser.checked) {
        const accountToCreate = {
          name: newUser.name,
          fullname: newUser.fullname,
          email: newUser.email,
          department: null
        };
        for (let ii = 0; ii < this.domainDepartments.length; ii++) {
          if (newUser.domainDepartment === this.domainDepartments[ii].name) {
            accountToCreate.department = this.domainDepartments[ii].department;
            break;
          }
        }
        accountsForCreate.push(accountToCreate);
      }
    }
    this.adminService.createAccounts(accountsForCreate).subscribe(() => {
      this.alertify.success('Пользователи успешно созданы');
      this.router.navigate(['/admin/users']);
    }, error => {
      console.log(error);
      this.alertify.error('ошибка создания пользователей');
    });
  }

  fillArrays() {
    for (let i = 0; i < this.domainUsers.length; i++) {
      let isNew = true;
      let isDepChange = true;
      const du = this.domainUsers[i];
      for (let ii = 0; ii < this.accounts.length; ii++) {
        const a = this.accounts[ii];
        if (a.name === du.name) {
          isNew = false;
          if (a.fullname !== du.fullname
            || a.email !== du.email) {
            this.changedUsers.push(du);
            isDepChange = false;
          } else if (a.department.domainDepartments) {
            for (let iii = 0; iii < a.department.domainDepartments.length; iii++) {
              if (a.department.domainDepartments[iii].name === du.domainDepartment) {
                isDepChange = false;
                break;
              }
            }
          }
          if (isDepChange) {
            this.changedUsers.push(du);
          }
          break;
        }
      }
      if (isNew) {
        for (let ii = 0; ii < this.domainDepartments.length; ii++) {
          if (du.domainDepartment === this.domainDepartments[ii].name) {
            this.newUsers.push(this.domainUsers[i]);
            break;
          }
        }
      }
    }
    this.newUsersForTable = this.newUsers;
    this.changedUsersForTable = this.changedUsers;
  }

  createFilterForm() {
    this.filterNewForm = this.fb.group({
      filterString: ['', [Validators.minLength(3), Validators.maxLength(20)]]
    });
    this.filterChangedForm = this.fb.group({
      filterString: ['', [Validators.minLength(3), Validators.maxLength(20)]]
    });
  }

  filterNew() {
    const filterValue = this.filterNewForm.get('filterString').value;
    this.newUsersForTable = [];
    this.newUsers.forEach(element => {
      if (element.name.includes(filterValue)) {
        this.newUsersForTable.push(element);
      } else if (element.fullname.includes(filterValue)) {
        this.newUsersForTable.push(element);
      } else if (element.email.includes(filterValue)) {
        this.newUsersForTable.push(element);
      } else if (element.domainDepartment.includes(filterValue)) {
        this.newUsersForTable.push(element);
      }
    });
    this.isNewFiltered = true;
  }

  filterChanged() {
    const filterValue = this.filterChangedForm.get('filterString').value;
    this.changedUsersForTable = [];
    this.changedUsers.forEach(element => {
      if (element.name.includes(filterValue)) {
        this.changedUsersForTable.push(element);
      } else if (element.fullname.includes(filterValue)) {
        this.changedUsersForTable.push(element);
      } else if (element.email.includes(filterValue)) {
        this.changedUsersForTable.push(element);
      } else if (element.domainDepartment.includes(filterValue)) {
        this.changedUsersForTable.push(element);
      }
    });
    this.isChangedFiltered = true;
  }

  unFilterNew() {
    this.filterNewForm.patchValue({filterString: ''});
    this.newUsersForTable = this.newUsers;
    this.isNewFiltered = false;
  }

  unFilterChanged() {
    this.filterChangedForm.patchValue({filterString: ''});
    this.changedUsersForTable = this.changedUsers;
    this.isChangedFiltered = false;
  }

  sortNewTable(param, sort) {
    if (sort) {
      this.newUsersForTable.sort((a, b) => (a[param] > b[param]) ? 1 : ((b[param] > a[param]) ? -1 : 0));
    } else {
      this.newUsersForTable.sort((b, a) => (a[param] > b[param]) ? 1 : ((b[param] > a[param]) ? -1 : 0));
    }
  }

  sortChangedTable(param, sort) {
    if (sort) {
      this.changedUsersForTable.sort((a, b) => (a[param] > b[param]) ? 1 : ((b[param] > a[param]) ? -1 : 0));
    } else {
      this.changedUsersForTable.sort((b, a) => (a[param] > b[param]) ? 1 : ((b[param] > a[param]) ? -1 : 0));
    }
  }

}
