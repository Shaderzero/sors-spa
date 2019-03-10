import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Department } from '../_models/department';
import { AuthService } from './auth.service';
import {ActivityType} from '../_models/references/activity-type';
import {Area} from '../_models/references/area';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient,
              private authService: AuthService) { }

  getDepartments(): Observable<Department[]> {
    return this.http.get<Department[]>(this.baseUrl + 'departments');
  }

  getDepartmentAccounts(departmentId: number) {
    return this.http.get(this.baseUrl + 'departments/' + departmentId + '/accounts');
  }
}
