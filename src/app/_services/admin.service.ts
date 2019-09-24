import {Injectable} from '@angular/core';
import {environment} from 'src/environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Department} from '../_models/department';
import {Account} from '../_models/account';
import {DomainDepartment} from '../_models/domainDepartment';
import {Observable} from 'rxjs';
import {Role} from '../_models/role';
import {PaginatedResult} from '../_models/pagination';
import {map} from 'rxjs/operators';
import {AuthService} from './auth.service';
import {Log} from '../_models/log';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient, private authService: AuthService) {
  }

  getDepartments(): Observable<Department[]> {
    return this.http.get<Department[]>(this.baseUrl + 'departments');
  }

  createDepartment(department: Department) {
    return this.http.post(this.baseUrl + 'departments', department);
  }

  updateDepartment(department: Department) {
    return this.http.put(this.baseUrl + 'departments/' + department.id, department);
  }

  deleteDepartment(department: Department) {
    return this.http.delete(this.baseUrl + 'departments/' + department.id);
  }

  getDomainDepartments() {
    return this.http.get<DomainDepartment[]>(this.baseUrl + 'admin/domaindepartments');
  }

  getDomainDepartmentsPage(page?, itemsPerPage?, depParams?): Observable<PaginatedResult<DomainDepartment[]>> {
    const paginatedResult: PaginatedResult<DomainDepartment[]> = new PaginatedResult<DomainDepartment[]>();
    let params = new HttpParams();
    params = params.append('accountId', this.authService.currentUser.id.toString());
    params = params.append('departmentId', this.authService.currentUser.department.id.toString());
    if (page != null && itemsPerPage != null) {
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemsPerPage);
    }
    if (depParams != null) {
      if (depParams.order != null && depParams.orderAsc != null) {
        params = params.append('order', depParams.order);
        params = params.append('orderAsc', depParams.orderAsc);
      }
      if (depParams.filter != null) {
        params = params.append('filter', depParams.filter);
      }
    }

    return this.http.get<DomainDepartment[]>(this.baseUrl + 'admin/domaindepartments', {observe: 'response', params})
      .pipe(
        map(response => {
          paginatedResult.result = response.body;
          if (response.headers.get('Pagination') !== null) {
            paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
          }
          return paginatedResult;
        })
      );
  }

  createDomainDepartment(department: DomainDepartment) {
    return this.http.post(this.baseUrl + 'admin/domaindepartments', department);
  }

  updateDomainDepartment(department: DomainDepartment) {
    return this.http.put(this.baseUrl + 'admin/domaindepartments/' + department.id, department);
  }

  deleteDomainDepartment(department: DomainDepartment) {
    return this.http.delete(this.baseUrl + 'admin/domaindepartments/' + department.id);
  }

  getDomainUsers() {
    return this.http.get(this.baseUrl + 'admin/domainusers');
  }

  getAccountRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(this.baseUrl + 'admin/accounts/roles');
  }

  getAccounts() {
    return this.http.get<Account[]>(this.baseUrl + 'admin/accounts');
  }

  getAccountsPaginated(page?, itemsPerPage?, accParams?): Observable<PaginatedResult<Account[]>> {
    const paginatedResult: PaginatedResult<Account[]> = new PaginatedResult<Account[]>();
    let params = new HttpParams();
    params = params.append('accountId', this.authService.currentUser.id.toString());
    params = params.append('departmentId', this.authService.currentUser.department.id.toString());
    if (page != null && itemsPerPage != null) {
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemsPerPage);
    }
    if (accParams != null) {
      if (accParams.order != null && accParams.orderAsc != null) {
        params = params.append('order', accParams.order);
        params = params.append('orderAsc', accParams.orderAsc);
      }
      if (accParams.filter != null) {
        params = params.append('filter', accParams.filter);
      }
    }

    return this.http.get<Account[]>(this.baseUrl + 'admin/accounts', {observe: 'response', params})
      .pipe(
        map(response => {
          paginatedResult.result = response.body;
          if (response.headers.get('Pagination') !== null) {
            paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
          }
          return paginatedResult;
        })
      );
  }

  getAcount(user: Account) {
    return this.http.get(this.baseUrl + 'admin/accounts/' + user.id);
  }

  createAccount(user: Account) {
    return this.http.post(this.baseUrl + 'admin/accounts', user);
  }

  createAccounts(users: Account[]) {
    return this.http.post(this.baseUrl + 'admin/accounts/array', users);
  }

  updateAccount(user: Account) {
    return this.http.put(this.baseUrl + 'admin/accounts/' + user.id, user);
  }

  updateAccounts(users: Account[]) {
    return this.http.put(this.baseUrl + 'admin/accounts/array', users);
  }

  deleteAccount(user: Account) {
    return this.http.delete(this.baseUrl + 'admin/accounts/' + user.id);
  }

  getLogsPaginated(page?, itemsPerPage?, accParams?): Observable<PaginatedResult<Log[]>> {
    const paginatedResult: PaginatedResult<Log[]> = new PaginatedResult<Log[]>();
    let params = new HttpParams();
    params = params.append('accountId', this.authService.currentUser.id.toString());
    params = params.append('departmentId', this.authService.currentUser.department.id.toString());
    if (page != null && itemsPerPage != null) {
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemsPerPage);
    }
    if (accParams != null) {
      if (accParams.order != null && accParams.orderAsc != null) {
        params = params.append('order', accParams.order);
        params = params.append('orderAsc', accParams.orderAsc);
      }
      if (accParams.filter != null) {
        params = params.append('filter', accParams.filter);
      }
    }

    return this.http.get<Log[]>(this.baseUrl + 'logs', {observe: 'response', params})
      .pipe(
        map(response => {
          paginatedResult.result = response.body;
          if (response.headers.get('Pagination') !== null) {
            paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
          }
          return paginatedResult;
        })
      );
  }

}
