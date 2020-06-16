import {Injectable} from '@angular/core';
import {environment} from 'src/environments/environment';
import {Observable} from 'rxjs';
import {PaginatedResult} from '../_models/pagination';
import {Incident} from '../_models/incident';
import {HttpClient, HttpParams} from '@angular/common/http';
import {AuthService} from './auth.service';
import {map} from 'rxjs/operators';
import {Draft} from '../_models/draft';
import {Responsible} from '../_models/responsible';
import {Department} from '../_models/department';
import {Patcher} from '../_models/patch';
import {PatcherDate} from '../_models/patchDate';

@Injectable({
  providedIn: 'root'
})
export class IncidentService {
  baseUrl = environment.apiUrl + 'incidents';

  constructor(private http: HttpClient,
              private authService: AuthService) {
  }

  getIncidents(page?, itemsPerPage?, incidentParams?): Observable<PaginatedResult<Incident[]>> {
    const paginatedResult: PaginatedResult<Incident[]> = new PaginatedResult<Incident[]>();
    let params = new HttpParams();
    params = params.append('accountId', this.authService.currentUser.id.toString());
    params = params.append('departmentId', this.authService.currentUser.department.id.toString());
    if (page != null && itemsPerPage != null) {
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemsPerPage);
    }
    if (incidentParams != null) {
      if (incidentParams.status != null) {
        params = params.append('status', incidentParams.status);
      } else {
        params = params.append('status', 'any');
      }
      if (incidentParams.type != null) {
        params = params.append('type', incidentParams.type);
      } else {
        if (this.authService.roleMatch(['riskManager'])) {
          params = params.append('type', 'forRM');
        } else if (this.authService.roleMatch(['riskCoordinator'])) {
          params = params.append('type', 'forRC');
        } else {
          params = params.append('type', 'forUser');
        }
      }
      if (incidentParams.order != null && incidentParams.orderAsc != null) {
        params = params.append('order', incidentParams.order);
        params = params.append('orderAsc', incidentParams.orderAsc);
      }
      if (incidentParams.filter != null) {
        params = params.append('filter', incidentParams.filter);
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

    return this.http.get<Incident[]>(this.baseUrl, {observe: 'response', params})
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

  getIncident(id): Observable<Incident> {
    return this.http.get<Incident>(this.baseUrl + '/' + id);
  }

  createIncident(incident: Incident) {
    return this.http.post(this.baseUrl, incident);
  }

  addDraft(incident: Incident, draft: Draft) {
    return this.http.get(this.baseUrl + '/' + incident.id + '/draftadd/' + draft.id);
  }

  removeDraft(incident: Incident, draft: Draft) {
    return this.http.get(this.baseUrl + '/' + incident.id + '/draftremove/' + draft.id);
  }

  patchIncident(incident: Incident, patch: Patcher[]) {
    return this.http.patch(this.baseUrl + '/' + incident.id, patch);
  }

  updateIncidentType(model: any) {
    return this.http.patch(this.baseUrl + '/' + model.id + '/type', model);
  }

  patchDateIncident(incident: Incident, patch: PatcherDate[]) {
    return this.http.patch(this.baseUrl + '/' + incident.id, patch);
  }

  updateIncident(incident: Incident) {
    return this.http.put(this.baseUrl + '/' + incident.id, incident);
  }

  deleteIncident(incident: Incident) {
    return this.http.post(this.baseUrl + '/' + incident.id, {});
  }

  setStatus(model: any) {
    return this.http.patch(this.baseUrl + '/' + model.id + '/status', model);
  }

  resign(model: any) {
    return this.http.patch(this.baseUrl + '/' + model.id + '/resign', model);
  }

  resignAll(model: any) {
    return this.http.patch(this.baseUrl + '/' + model.id + '/resignall', model);
  }

  addResponsible(incident: Incident, department: Department) {
    return this.http.get(this.baseUrl + '/' + incident.id + '/responsibleadd/' + department.id);
  }

  getHistory(incidentId: number) {
    return this.http.get(this.baseUrl + '/' + incidentId + '/history');
  }

  removeResponsible(incident: Incident, responsible: Responsible) {
    return this.http.get(this.baseUrl + '/' + incident.id + '/responsibleremove/' + responsible.id);
  }

  updateResponsibleAccounts(responsible: Responsible) {
    return this.http.put(this.baseUrl + '/responsible/' + responsible.id, responsible.accounts);
  }

  closeIncident(incident: Incident) {
    return this.http.get(this.baseUrl + '/' + incident.id + '/close');
  }

  approveIncident(incidentId: number, departmentId: number) {
    return this.http.get(this.baseUrl + '/' + incidentId + '/approve/' + departmentId);
  }

  getReport(incidentParams?) {
    const paginatedResult: PaginatedResult<Incident[]> = new PaginatedResult<Incident[]>();
    let params = new HttpParams();
    params = params.append('accountId', this.authService.currentUser.id.toString());
    params = params.append('departmentId', this.authService.currentUser.department.id.toString());
    if (incidentParams != null) {
      if (incidentParams.status != null) {
        params = params.append('status', incidentParams.status);
      } else {
        params = params.append('status', 'any');
      }
      if (incidentParams.type != null) {
        params = params.append('type', incidentParams.type);
      } else {
        if (this.authService.roleMatch(['riskManager'])) {
          params = params.append('type', 'forRM');
        } else if (this.authService.roleMatch(['riskCoordinator'])) {
          params = params.append('type', 'forRC');
        } else {
          params = params.append('type', 'forUser');
        }
      }
      if (incidentParams.order != null && incidentParams.orderAsc != null) {
        params = params.append('order', incidentParams.order);
        params = params.append('orderAsc', incidentParams.orderAsc);
      }
      if (incidentParams.filter != null) {
        params = params.append('filter', incidentParams.filter);
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

    return this.http.get(this.baseUrl + '/report', {responseType: 'blob', params})
      .subscribe(data => this.downloadFile(data),
        error => console.log('Error downloading the file.'),
        () => console.log('OK'));
  }

  getExcel(id) {
    return this.http.get(this.baseUrl + '/' + id + '/excel', {responseType: 'blob'})
      .subscribe(data => this.downloadFile(data),
        error => console.log('Error downloading the file.'),
        () => console.log('OK'));
  }

  getReportBase(page?, itemsPerPage?, incidentParams?) {
    const paginatedResult: PaginatedResult<Incident[]> = new PaginatedResult<Incident[]>();
    let params = new HttpParams();
    params = params.append('accountId', this.authService.currentUser.id.toString());
    params = params.append('departmentId', this.authService.currentUser.department.id.toString());
    if (page != null && itemsPerPage != null) {
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemsPerPage);
    }
    if (incidentParams != null) {
      if (incidentParams.status != null) {
        params = params.append('status', incidentParams.status);
      } else {
        params = params.append('status', 'any');
      }
      if (incidentParams.type != null) {
        params = params.append('type', incidentParams.type);
      } else {
        if (this.authService.roleMatch(['riskManager'])) {
          params = params.append('type', 'forRM');
        } else if (this.authService.roleMatch(['riskCoordinator'])) {
          params = params.append('type', 'forRC');
        } else {
          params = params.append('type', 'forUser');
        }
      }
      if (incidentParams.order != null && incidentParams.orderAsc != null) {
        params = params.append('order', incidentParams.order);
        params = params.append('orderAsc', incidentParams.orderAsc);
      }
      if (incidentParams.filter != null) {
        params = params.append('filter', incidentParams.filter);
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

    return this.http.get(this.baseUrl + '/report', {responseType: 'blob', params})
      .subscribe(data => this.downloadFile(data),
        error => console.log('Error downloading the file.'),
        () => console.log('OK'));
  }

  downloadFile(data: any) {
    // console.log(data);
    console.log('inside incident service');
    const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    console.log(url);
    if (navigator.appVersion.toString().indexOf('.NET') > 0) {
      window.navigator.msSaveBlob(blob, 'report.xlsx');
    } else {
      window.open(url);
    }
    // let url = '';
    // if (!window.location.origin) {
    //   url = 'file://' + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
    // } else {
    //   url = window.location.origin;
    // }
    // url = url + '/reports/report.xlsx';
    // window.open(url);
  }

}
