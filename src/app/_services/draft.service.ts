import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {PaginatedResult} from '../_models/pagination';
import {Draft} from '../_models/draft';
import {AuthService} from './auth.service';
import {environment} from 'src/environments/environment';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DraftService {
  baseUrl = environment.apiUrl + 'drafts';

  constructor(private http: HttpClient,
              private authService: AuthService) {
  }

  getDrafts(page?, itemsPerPage?, draftParams?): Observable<PaginatedResult<Draft[]>> {
    const paginatedResult: PaginatedResult<Draft[]> = new PaginatedResult<Draft[]>();
    let params = new HttpParams();
    params = params.append('accountId', this.authService.currentUser.id.toString());
    params = params.append('departmentId', this.authService.currentUser.department.id.toString());
    if (page != null && itemsPerPage != null) {
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemsPerPage);
    }
    if (draftParams != null) {
      if (draftParams.status != null) {
        params = params.append('status', draftParams.status);
      } else {
        params = params.append('status', 'any');
      }
      if (draftParams.type != null) {
        params = params.append('type', draftParams.type);
      } else {
        if (this.authService.roleMatch(['admin'])) {
          params = params.append('type', 'forAdmin');
        } else if (this.authService.roleMatch(['riskManager'])) {
          params = params.append('type', 'forRM');
        } else if (this.authService.roleMatch(['riskCoordinator'])) {
          params = params.append('type', 'forRC');
        } else {
          params = params.append('type', 'forUser');
        }
      }
      if (draftParams.order != null && draftParams.orderAsc != null) {
        params = params.append('order', draftParams.order);
        params = params.append('orderAsc', draftParams.orderAsc);
      }
      if (draftParams.filter != null) {
        params = params.append('filter', draftParams.filter);
      }
    } else {
      params = params.append('status', 'any');
      if (this.authService.roleMatch(['riskManager'])) {
        params = params.append('type', 'forRM');
      } else if (this.authService.roleMatch(['riskCoordinator'])) {
        params = params.append('type', 'forRC');
      } else {
        params = params.append('type', 'forUser');
      }
    }

    return this.http.get<Draft[]>(this.baseUrl, {observe: 'response', params})
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

  getDraftsForIncident(): Observable<Draft[]> {
    return this.http.get<Draft[]>(this.baseUrl + '/forincident');
  }

  getDraft(id): Observable<Draft> {
    return this.http.get<Draft>(this.baseUrl + '/' + id);
  }

  createDraft(draft: Draft) {
    return this.http.post(this.baseUrl, draft);
  }

  updateDraft(draft: Draft) {
    return this.http.put(this.baseUrl + '/' + draft.id, draft);
  }

  deleteDraft(draft: Draft) {
    return this.http.post(this.baseUrl + '/' + draft.id, {});
  }

  setStatus(model: any) {
    return this.http.patch(this.baseUrl + '/' + model.id + '/status', model);
  }

}
