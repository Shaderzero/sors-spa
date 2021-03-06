import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, Router} from '@angular/router';
import {AuthService} from '../_services/auth.service';
import {AlertifyService} from '../_services/alertify.service';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RolesGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router, private alertify: AlertifyService) {
  }

  canActivate(next: ActivatedRouteSnapshot): Observable<boolean> | boolean {
    const roles = next.data.roles;
    if (this.authService.currentUser) {
      if (roles) {
        return this.checkRoles(roles);
      }
      return true;
    }
    return false;
  }

  checkRoles(roles: string[]): boolean {
    const match = this.authService.roleMatch(roles);
    if (match) {
      return true;
    } else {
      this.router.navigate(['']);
      this.alertify.error('Отсутствуют права доступа для данной зоны');
      return false;
    }
  }

}
