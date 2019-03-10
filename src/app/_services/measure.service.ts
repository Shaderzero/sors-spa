import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from 'src/environments/environment';
import {Measure} from '../_models/measure';
import {Observable} from 'rxjs';
import {Patcher} from '../_models/patch';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class MeasureService {
  baseUrl = environment.apiUrl + 'measures';

  constructor(private http: HttpClient,
              private authService: AuthService) {
  }

  getMeasures(responsibleId: number, measureParams?): Observable<Measure[]> {
    let params = new HttpParams();
    params = params.append('accountId', this.authService.currentUser.id.toString());
    params = params.append('departmentId', this.authService.currentUser.department.id.toString());
    if (measureParams != null) {
      if (measureParams.status != null) {
        params = params.append('status', measureParams.status);
      } else {
        params = params.append('status', 'any');
      }
      if (measureParams.order != null && measureParams.orderAsc != null) {
        params = params.append('order', measureParams.order);
        params = params.append('orderAsc', measureParams.orderAsc);
      }
      if (measureParams.filter != null) {
        params = params.append('filter', measureParams.filter);
      }
    } else {
      params = params.append('status', 'any');
    }
    return this.http.get<Measure[]>(this.baseUrl + '/responsible/' + responsibleId, {params: params});
  }

  createMeasure(measure: Measure) {
    return this.http.post(this.baseUrl, measure);
  }

  updateMeasure(measure: Measure) {
    return this.http.put(this.baseUrl + '/' + measure.id, measure);
  }

  deleteMeasure(measureId: number) {
    return this.http.delete(this.baseUrl + '/' + measureId);
  }

  signMeasure(measureId: number, patcher: Patcher[]) {
    return this.http.patch(this.baseUrl + '/' + measureId, patcher);
  }

}
