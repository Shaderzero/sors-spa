import {Injectable} from '@angular/core';
import {Resolve, Router, ActivatedRouteSnapshot} from '@angular/router';
import {Observable, of} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {AdminService} from 'src/app/_services/admin.service';
import {AlertifyService} from '../../_services/alertify.service';
import {Log} from '../../_models/log';

@Injectable()
export class LogsPageResolver implements Resolve<Log[]> {
  pageNumber = 1;
  pageSize = 20;
  logParams: any = {};

  constructor(private adminService: AdminService, private route: Router, private alertify: AlertifyService) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<Log[]> {
    return this.adminService.getLogsPaginated(
      this.pageNumber,
      this.pageSize,
      this.logParams
    ).pipe(
      catchError(error => {
        console.log(error);
        this.alertify.error('Ошибка получения данных');
        this.route.navigate(['']);
        return of(null);
      })
    );
  }

}
