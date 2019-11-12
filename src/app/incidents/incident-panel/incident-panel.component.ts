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
  counts: Counts;

  constructor(private authService: AuthService,
              private draftService: DraftService,
              private countsService: CountsService,
              private excelService: ExcelService) {
  }

  ngOnInit() {
    this.getUserRole();
    this.counts = this.countsService.counts;
  }

  getUserRole() {
    if (this.authService.roleMatch(['riskManager'])) {
      this.role = 'riskManager';
    } else if (this.authService.roleMatch(['riskCoordinator'])) {
      this.role = 'riskCoordinator';
    } else if (this.authService.roleMatch(['user'])) {
      this.role = 'user';
    }
  }

  report() {
    this.excelService.getReport();
  }
}
