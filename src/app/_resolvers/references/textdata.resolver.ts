import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router} from '@angular/router';
import {Observable, of} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {AlertifyService} from 'src/app/_services/alertify.service';
import {TextData} from '../../_models/text-data';
import {TextDataService} from '../../_services/text-data.service';

@Injectable()
export class TextDatasResolver implements Resolve<TextData[]> {

  constructor(private textDataService: TextDataService,
              private route: Router,
              private alertify: AlertifyService) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<TextData[]> {
    return this.textDataService.getTextDatas().pipe(
      catchError(error => {
        console.log(error);
        this.alertify.error('Ошибка получения данных');
        this.route.navigate(['/admin']);
        return of(null);
      })
    );
  }
}
