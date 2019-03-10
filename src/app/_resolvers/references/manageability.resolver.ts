import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { Manageability } from 'src/app/_models/references/manageability';
import {ReferenceService} from '../../_services/reference.service';


@Injectable()
export class ManageabilitiesResolver implements Resolve<Manageability[]> {

    constructor(private refService: ReferenceService, private route: Router, private alertify: AlertifyService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<Manageability[]> {
        return this.refService.getManageabilities().pipe(
            catchError(error => {
                this.alertify.error('проблема с получением данных');
                this.route.navigate(['/admin']);
                return of(null);
            })
        );
    }
}
