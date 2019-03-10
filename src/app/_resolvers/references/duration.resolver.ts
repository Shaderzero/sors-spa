import {Injectable} from '@angular/core';
import {Resolve, Router, ActivatedRouteSnapshot} from '@angular/router';
import {Observable, of} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {AlertifyService} from 'src/app/_services/alertify.service';
import {Duration} from 'src/app/_models/references/duration';
import {ReferenceService} from '../../_services/reference.service';


@Injectable()
export class DurationsResolver implements Resolve<Duration[]> {

  constructor(private refService: ReferenceService, private route: Router, private alertify: AlertifyService) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<Duration[]> {
    return this.refService.getDurations().pipe(
      catchError(error => {
        this.alertify.error('проблема с получением данных');
        this.route.navigate(['/references']);
        return of(null);
      })
    );
  }
}
