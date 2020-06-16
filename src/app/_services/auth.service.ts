import {Injectable} from '@angular/core';
import {environment} from 'src/environments/environment';
import {Account} from '../_models/account';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Department} from '../_models/department';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl = environment.apiUrl + 'auth';
  currentUser: Account;
  accounts: Account[];
  departments: Department[];

  constructor(private http: HttpClient) {
  }

  getCurrentUser(): Observable<Account> {
    return this.http.get<Account>(this.baseUrl);
  }

  setCurrentUser(user) {
    this.currentUser = user;
    this.login();
  }

  getAccounts(): Account[] {
    return this.accounts;
  }

  login() {
    this.http.get(this.baseUrl + '/departments').subscribe((res: Department[]) => {
      this.departments = res;
    }, error => {
      console.log('get departments list failed');
      console.log(error);
    });
    this.http.get(this.baseUrl + '/users').subscribe((res: Account[]) => {
      this.accounts = res;
      // console.log(this.accounts);
    }, error => {
      console.log('get users list failed');
      console.log(error);
    });
  }

  isRiskCoordinator(department: Department) {
    if (this.roleMatch(['riskCoordinator'])) {
      if (+this.currentUser.department.id === +department.id) {
        return true;
      }
    }
    return false;
  }

  isRiskManager() {
    if (this.roleMatch(['riskManager'])) {
      return true;
    }
    return false;
  }

  isAdmin() {
    if (this.roleMatch(['admin'])) {
      return true;
    }
    return false;
  }

  isSecurity() {
    if (this.roleMatch(['admin', 'security'])) {
      return true;
    }
    return false;
  }

  roleMatch(allowedRoles: string[]): boolean {
    if (!this.currentUser) {
      return false;
    }
    let result = false;
    allowedRoles.forEach(element => {
      for (let i = 0; i < this.currentUser.accountRoles.length; i++) {
        if (this.currentUser.accountRoles[i].name === element) {
          result = true;
          break;
        }
      }
    });
    return result;
  }

  accountHasRole(account: Account, role: string): boolean {
    if (!account.accountRoles) {
      return false;
    }
    let result = false;
    for (let i = 0; i < account.accountRoles.length; i++) {
      if (account.accountRoles[i].name === role) {
        result = true;
        break;
      }
    }
    return result;
  }

}
