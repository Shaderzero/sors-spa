import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { Significance } from 'src/app/_models/references/significance';
import {ReferenceService} from '../../_services/reference.service';


@Injectable()
export class SignificancesResolver implements Resolve<Significance[]> {

    constructor(private refService: ReferenceService, private route: Router, private alertify: AlertifyService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<Significance[]> {
        return this.refService.getSignificances().pipe(
            catchError(error => {
                this.alertify.error('проблема с получением данных');
                this.route.navigate(['/admin']);
                return of(null);
            })
        );
    }
}
