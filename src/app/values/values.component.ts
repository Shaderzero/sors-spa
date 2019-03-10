import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AuthService} from '../_services/auth.service';
import {Account} from '../_models/account';
import {environment} from 'src/environments/environment';

@Component({
  selector: 'app-values',
  templateUrl: './values.component.html',
  styleUrls: ['./values.component.css']
})
export class ValuesComponent implements OnInit {
  baseUrl = environment.apiUrl;
  values: string[];
  currentUser: Account;

  constructor(private http: HttpClient, private authService: AuthService) {
  }

  ngOnInit() {
    this.getValues().subscribe(res => {
      console.log(res);
      this.values = res;
    });
    this.authService.getCurrentUser().subscribe(res => {
      console.log(res);
      this.currentUser = res;
    });
  }

  getValues(): Observable<string[]> {
    return this.http.get<string[]>(this.baseUrl + 'values', {withCredentials: true});
  }

}
