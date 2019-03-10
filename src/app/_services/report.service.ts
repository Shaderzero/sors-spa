import {Injectable} from '@angular/core';
import {environment} from 'src/environments/environment';
import {Report} from '../_models/report';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Patcher} from '../_models/patch';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  baseUrl = environment.apiUrl + 'reports';

  constructor(private http: HttpClient) {
  }

  getReports(measureId: number): Observable<Report[]> {
    return this.http.get<Report[]>(this.baseUrl + '/measure/' + measureId);
  }

  createReport(report: Report) {
    return this.http.post(this.baseUrl, report);
  }

  updateReport(report: Report) {
    return this.http.put(this.baseUrl + '/' + report.id, report);
  }

  deleteReport(reportId: number) {
    return this.http.delete(this.baseUrl + '/' + reportId);
  }

  signReport(reportId: number, patcher: Patcher[]) {
    return this.http.patch(this.baseUrl + '/' + reportId, patcher);
  }
}
