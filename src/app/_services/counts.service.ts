import {Injectable, OnInit} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AuthService} from './auth.service';
import {Counts} from '../_models/counts';

@Injectable({
  providedIn: 'root'
})
export class CountsService {
  baseUrl = environment.apiUrl;
  role: string;
  params: any;
  public counts: Counts = {
    countCheck: 0,
    countClose: 0,
    countDraft: 0,
    countOpen: 0,
    countRefine: 0,
    countSign: 0
  };

  constructor(private http: HttpClient,
              private authService: AuthService) {
    this.init();
  }

  init() {
    this.params = {
      accountId: this.authService.currentUser.id,
      departmentId: this.authService.currentUser.department.id
    };
    if (this.authService.roleMatch(['riskManager'])) {
      this.role = 'riskManager';
      this.params.type = 'forRM';
    } else if (this.authService.roleMatch(['riskCoordinator'])) {
      this.role = 'riskCoordinator';
      this.params.type = 'forRC';
    } else if (this.authService.roleMatch(['user'])) {
      this.role = 'user';
      this.params.type = 'forUser';
    }
    this.loadAll();
  }

  loadAll() {
    this.loadCheckCounts();
    this.loadCloseCounts();
    this.loadDraftCounts();
    this.loadOpenCounts();
    this.loadRefineCounts();
    this.loadSignCounts();
  }

  loadDraftCounts() {
    this.getCounts('draft').subscribe(res => {
      this.counts.countDraft = res;
    });
  }

  loadSignCounts() {
    this.getCounts('sign').subscribe(res => {
      this.counts.countSign = res;
    });
  }

  loadCheckCounts() {
    this.getCounts('check').subscribe(res => {
      this.counts.countCheck = res;
    });
  }

  loadRefineCounts() {
    this.getCounts('refine').subscribe(res => {
      this.counts.countRefine = res;
    });
  }

  loadCloseCounts() {
    this.getCounts('close').subscribe(res => {
      this.counts.countClose = res;
    });
  }

  loadOpenCounts() {
    this.getCounts('open').subscribe(res => {
      this.counts.countOpen = res;
    });
  }

  getCounts(status: string): Observable<number> {
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
