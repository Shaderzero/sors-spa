import {Injectable} from '@angular/core';
import {Resolve, Router, ActivatedRouteSnapshot} from '@angular/router';
import {Observable, of} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {Incident} from 'src/app/_models/incident';
import {IncidentService} from '../_services/incident.service';
import {AlertifyService} from '../_services/alertify.service';

@Injectable()
export class IncidentResolver implements Resolve<Incident> {

  constructor(private incidentService: IncidentService,
              private route: Router,
              private alertify: AlertifyService) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<Incident> {
    return this.incidentService.getIncident(route.params['id']).pipe(
      catchError(error => {
        console.log(error.message);
        if (+error.status === 403) {
          this.alertify.error('Access denied');
        } else {
          this.alertify.error(error.message);
        }
        this.route.navigate(['/incidents/list']);
        return of(null);
      })
    );
  }
}
