import {Injectable} from '@angular/core';
import {Resolve, Router, ActivatedRouteSnapshot} from '@angular/router';
import {Observable, of} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {Incident} from 'src/app/_models/incident';
import {IncidentService} from '../_services/incident.service';
import {AlertifyService} from '../_services/alertify.service';

@Injectable()
export class IncidentsResolver implements Resolve<Incident[]> {
  pageNumber = 1;
  pageSize = 10;
  incidentParams: any = {};

  constructor(private incidentService: IncidentService,
              private route: Router,
              private alertify: AlertifyService) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<Incident[]> {
    const status = route.data['status'];
    if (status) {
      this.incidentParams.status = status;
    } else {
      this.incidentParams.status = 'any';
    }
    return this.incidentService.getIncidents(
      this.pageNumber,
      this.pageSize,
      this.incidentParams
    ).pipe(
      catchError(error => {
        console.log(error);
        this.alertify.error('Ошибка получения данных');
        this.route.navigate(['/incidents']);
        return of(null);
      })
    );
  }
}
