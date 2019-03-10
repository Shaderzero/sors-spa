import { Component } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import {LoaderService} from '../_helpers/loader/loader.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent {

  constructor(public authService: AuthService, public loaderService: LoaderService) { }

}
