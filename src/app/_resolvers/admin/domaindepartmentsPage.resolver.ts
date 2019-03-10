import {Injectable} from '@angular/core';
import {Resolve, Router, ActivatedRouteSnapshot} from '@angular/router';
import {Observable, of} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {DomainDepartment} from 'src/app/_models/domainDepartment';
import {AdminService} from 'src/app/_services/admin.service';
import {AlertifyService} from '../../_services/alertify.service';

@Injectable()
export class DomainDepartmentsPageResolver implements Resolve<DomainDepartment[]> {
  pageNumber = 1;
  pageSize = 10;
  depParams: any = {};

  constructor(private adminService: AdminService, private route: Router, private alertify: AlertifyService) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<DomainDepartment[]> {
    return this.adminService.getDomainDepartmentsPage(
      this.pageNumber,
      this.pageSize,
      this.depParams
    ).pipe(
      catchError(error => {
        console.log(error);
        this.alertify.error('Ошибка получения данных');
        this.route.navigate(['/admin']);
        return of(null);
      })
    );
  }
}
