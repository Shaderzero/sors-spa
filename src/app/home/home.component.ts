import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {TextDataService} from '../_services/text-data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private router: Router, private route: ActivatedRoute, private textDataService: TextDataService) {
  }

  ngOnInit() {
    let siteUrl = '';
    if (!window.location.origin) {
      siteUrl = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
    } else {
      siteUrl = window.location.origin;
    }
    console.log(siteUrl);
    // this.route.data.subscribe(data => {
    //   this.textDataService.textDatas = data.textdatas;
    // });
  }

}
