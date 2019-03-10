import {Injectable} from '@angular/core';
import {Resolve, Router, ActivatedRouteSnapshot} from '@angular/router';
import {Observable, of} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {Department} from 'src/app/_models/department';
import {UserService} from 'src/app/_services/user.service';

@Injectable()
export class DepartmentsResolver implements Resolve<Department[]> {

  constructor(private userService: UserService, private route: Router) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<Department[]> {
    return this.userService.getDepartments().pipe(
      catchError(error => {
        console.log(error);
        this.route.navigate(['/home']);
        return of(null);
      })
    );
  }
}
