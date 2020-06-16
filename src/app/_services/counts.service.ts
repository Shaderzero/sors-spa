import {Injectable, OnInit} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AuthService} from './auth.service';
import {Counts} from '../_models/counts';
import {IncidentPanelComponent} from '../incidents/incident-panel/incident-panel.component';

@Injectable({
  providedIn: 'root'
})
export class CountsService {
  baseUrl = environment.apiUrl;
  role: string;
  params: any;
  public counts: Counts = {
    draftCount: 0,
    rcCount: 0,
    rmCount: 0,
    openCount: 0,
    refineCount: 0,
    closeCount: 0,
    waitIncidentCount: 0,
    refineIncidentCount: 0,
    openIncidentCount: 0
  };

  constructor(private http: HttpClient,
              private authService: AuthService) {
    this.init();
  }

  init() {
    this.params = {
      accountId: this.authService.currentUser.id
    };
  }

  updateCounts() {
    let params = new HttpParams();
    params = params.append('accountId', this.params.accountId);
    this.http.get<Counts>(this.baseUrl + 'counts', {params}).subscribe(res => {
      this.counts = res;
    });
  }

  getCountsOld(status: string): Observable<number> {
    let params = new HttpParams();
    params = params.append('accountId', this.params.accountId);
    params = params.append('departmentId', this.params.departmentId);
    params = params.append('status', status);
    params = params.append('type', this.params.type);
    if (status === 'draft') {
      params = params.append('type', 'forUser');
    } else {
      params = params.append('type', this.params.type);
    }
    return this.http.get<number>(this.baseUrl + 'drafts/counts', {params});
  }
}
