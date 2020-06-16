import {Component, OnInit} from '@angular/core';
import {AuthService} from 'src/app/_services/auth.service';
import {DraftService} from '../../_services/draft.service';
import {CountsService} from '../../_services/counts.service';
import {Counts} from '../../_models/counts';
import {ExcelService} from '../../_services/excel.service';

@Component({
  selector: 'app-incident-panel',
  templateUrl: './incident-panel.component.html',
  styleUrls: ['./incident-panel.component.css']
})
export class IncidentPanelComponent implements OnInit {
  role: string;

  constructor(private authService: AuthService,
              private draftService: DraftService,
              public countsService: CountsService,
              private excelService: ExcelService) {
  }

  ngOnInit() {
    this.getUserRole();
    this.countsService.updateCounts();
  }

  getUserRole() {
    if (this.authService.roleMatch(['admin'])) {
      this.role = 'admin';
    } else if (this.authService.roleMatch(['riskManager'])) {
      this.role = 'riskManager';
    } else if (this.authService.roleMatch(['riskCoordinator'])) {
      this.role = 'riskCoordinator';
    } else {
      this.role = 'user';
    }
    console.log('роль: ' + this.role);
  }

  report() {
    this.excelService.getReport();
  }
}
