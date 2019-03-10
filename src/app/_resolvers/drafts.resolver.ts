import {Injectable} from '@angular/core';
import {Resolve, Router, ActivatedRouteSnapshot} from '@angular/router';
import {Observable, of} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {Draft} from 'src/app/_models/draft';
import {AlertifyService} from 'src/app/_services/alertify.service';
import {DraftService} from '../_services/draft.service';

@Injectable()
export class DraftsResolver implements Resolve<Draft[]> {
  pageNumber = 1;
  pageSize = 10;
  draftParams: any = {};

  constructor(private draftService: DraftService,
              private route: Router,
              private alertify: AlertifyService) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<Draft[]> {
    const status = route.data['status'];
    if (status) {
      this.draftParams.status = status;
    } else {
      this.draftParams.status = 'any';
    }
    return this.draftService.getDrafts(
      this.pageNumber,
      this.pageSize,
      this.draftParams
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
