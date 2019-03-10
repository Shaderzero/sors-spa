import {Injectable} from '@angular/core';
import {Resolve, Router, ActivatedRouteSnapshot} from '@angular/router';
import {Observable, of} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {AlertifyService} from 'src/app/_services/alertify.service';
import {ActivityType} from '../../_models/references/activity-type';
import {ReferenceService} from '../../_services/reference.service';

@Injectable()
export class ActivityTypesResolver implements Resolve<ActivityType[]> {

  constructor(private refService: ReferenceService,
              private route: Router,
              private alertify: AlertifyService) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<ActivityType[]> {
    return this.refService.getActivityTypes().pipe(
      catchError(error => {
        console.log(error);
        this.alertify.error('Ошибка получения данных');
        this.route.navigate(['/admin']);
        return of(null);
      })
    );
  }
}
