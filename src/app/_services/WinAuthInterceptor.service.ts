import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {LoaderService} from '../_helpers/loader/loader.service';
import {catchError, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WinAuthInterceptor implements HttpInterceptor {
  private totalRequests = 0;

  constructor(private loaderService: LoaderService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // request = request.clone({ headers: request.headers.set('withCredentials', 'true') });
    this.totalRequests++;
    this.loaderService.setLoading(true);
    request = request.clone({
      withCredentials: true,
      // добавлено для совместимости с IE
      headers: request.headers.set('Cache-Control', 'no-cache')
        .set('Pragma', 'no-cache')
        .set('Expires', 'Sat, 01 Jan 2000 00:00:00 GMT')
        .set('If-Modified-Since', '0')
    });
    return next.handle(request).pipe(
      tap(res => {
        if (res instanceof HttpResponse) {
          this.decreaseRequests();
        }
      }),
      catchError(err => {
        this.decreaseRequests();
        throw err;
      })
    );
  }

  private decreaseRequests() {
    this.totalRequests--;
    if (this.totalRequests <= 0) {
      this.totalRequests = 0;
      this.loaderService.setLoading(false);
    }
  }
}
