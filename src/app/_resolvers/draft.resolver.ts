import {Injectable} from '@angular/core';
import {Resolve, Router, ActivatedRouteSnapshot} from '@angular/router';
import {Observable, of} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {Draft} from 'src/app/_models/draft';
import {AlertifyService} from 'src/app/_services/alertify.service';
import {DraftService} from '../_services/draft.service';

@Injectable()
export class DraftResolver implements Resolve<Draft> {
  constructor(private draftService: DraftService,
              private route: Router,
              private alertify: AlertifyService) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<Draft> {
    return this.draftService.getDraft(route.params['id']).pipe(
      catchError(error => {
        console.log(error);
        this.alertify.error('Ошибка получения данных');
        this.route.navigate(['/incidents/drafts']);
        return of(null);
      })
    );
  }
}
