import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {
  baseUrl = environment.apiUrl + 'excel';

  constructor(private http: HttpClient) {
  }

  getReport() {
    this.getExcel().subscribe(data => this.downloadFile(data),
      error => console.log('Error downloading the file.'),
      () => console.log('OK'));
  }

  downloadFile(data: any) {
    // console.log(data);
    const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    // let url = '';
    // if (!window.location.origin) {
    //   url = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
    // } else {
    //   url = window.location.origin;
    // }
    // url = url + '/reports/report.xlsx'
    window.open(url);
  }

  getExcel() {
    return this.http.get(this.baseUrl, {responseType: 'blob'});
  }

}
