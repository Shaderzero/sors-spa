import {Injectable} from '@angular/core';
import {Resolve, Router, ActivatedRouteSnapshot} from '@angular/router';
import {Observable, of} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {AlertifyService} from 'src/app/_services/alertify.service';
import {Reaction} from 'src/app/_models/references/reaction';
import {ReferenceService} from '../../_services/reference.service';


@Injectable()
export class ReactionsResolver implements Resolve<Reaction[]> {

  constructor(private refService: ReferenceService, private route: Router, private alertify: AlertifyService) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<Reaction[]> {
    return this.refService.getReactions().pipe(
      catchError(error => {
        this.alertify.error('проблема с получением данных');
        this.route.navigate(['/admin']);
        return of(null);
      })
    );
  }
}
