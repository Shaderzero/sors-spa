import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/_services/auth.service';
import {DraftService} from '../../_services/draft.service';

@Component({
  selector: 'app-incident-panel',
  templateUrl: './incident-panel.component.html',
  styleUrls: ['./incident-panel.component.css']
})
export class IncidentPanelComponent implements OnInit {
  role: string;
  collapseDrafts = false;
  countDraft: number;
  countCheck: number;
  countSign: number;
  countRefine: number;
  countOpen: number;
  countClose: number;

  constructor(private authService: AuthService,
              private draftService: DraftService) { }

  ngOnInit() {
    this.getUserRole();
    this.getCounts(); // на будущее
  }

  reload(result: Boolean) {
    if (result) {
      // this.getCounts();
    }
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

  getCounts() {
    const draftParams = {
      accountId: this.authService.currentUser.id,
      departmentId: this.authService.currentUser.department.id,
      type: 'forUser',
      status: 'draft'
    };
    this.draftService.getCountDrafts(draftParams).subscribe((res: number) => {
      this.countDraft = res;
    }, error => {
      console.log('cannot get count of drafts, ' + error);
    });
    if (this.role === 'user') {
      draftParams.type = 'forUser';
    } else if (this.role === 'riskCoordinator') {
      draftParams.type = 'forRC';
    } else if (this.role === 'riskManager') {
      draftParams.type = 'forRM';
    }
    draftParams.status = 'check';
    this.draftService.getCountDrafts(draftParams).subscribe((res: number) => {
      this.countCheck = res;
    }, error => {
      console.log('cannot get count of check, ' + error);
    });
    draftParams.status = 'sign';
    this.draftService.getCountDrafts(draftParams).subscribe((res: number) => {
      this.countSign = res;
    }, error => {
      console.log('cannot get count of sign, ' + error);
    });
    draftParams.status = 'refine';
    this.draftService.getCountDrafts(draftParams).subscribe((res: number) => {
      this.countRefine = res;
    }, error => {
      console.log('cannot get count of refine, ' + error);
    });
    draftParams.status = 'close';
    this.draftService.getCountDrafts(draftParams).subscribe((res: number) => {
      this.countClose = res;
    }, error => {
      console.log('cannot get count of close, ' + error);
    });
    draftParams.status = 'open';
    this.draftService.getCountDrafts(draftParams).subscribe((res: number) => {
      this.countOpen = res;
    }, error => {
      console.log('cannot get count of open, ' + error);
    });
  }

}
