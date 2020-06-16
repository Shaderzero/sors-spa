import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router} from '@angular/router';
import {Observable, of} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {AlertifyService} from 'src/app/_services/alertify.service';
import {IncidentType} from '../../_models/references/IncidentType';
import {ReferenceService} from '../../_services/reference.service';

@Injectable()
export class IncidentTypesResolver implements Resolve<IncidentType[]> {

  constructor(private refService: ReferenceService,
              private route: Router,
              private alertify: AlertifyService) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<IncidentType[]> {
    return this.refService.getIncidentTypes().pipe(
      catchError(error => {
        console.log(error);
        this.alertify.error('Ошибка получения данных');
        this.route.navigate(['/admin']);
        return of(null);
      })
    );
  }
}
