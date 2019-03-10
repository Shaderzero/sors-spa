import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-references-panel',
  templateUrl: './references-panel.component.html',
  styleUrls: ['./references-panel.component.css']
})
export class ReferencesPanelComponent implements OnInit {
  checkRcCount: number;
  checkRmCount: number;
  departmentId: number;

  constructor() { }

  ngOnInit() {
  }

}
