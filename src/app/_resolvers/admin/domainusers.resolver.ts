import {Injectable} from '@angular/core';
import {Resolve, Router, ActivatedRouteSnapshot} from '@angular/router';
import {Observable, of} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {AdminService} from 'src/app/_services/admin.service';
import {DomainUser} from 'src/app/_models/domainUser';

@Injectable()
export class DomainUsersResolver implements Resolve<DomainUser[]> {

  constructor(private adminService: AdminService, private route: Router) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<DomainUser[]> {
    return this.adminService.getDomainUsers().pipe(
      catchError(error => {
        console.log(error);
        this.route.navigate(['/home']);
        return of(null);
      })
    );
  }
}
