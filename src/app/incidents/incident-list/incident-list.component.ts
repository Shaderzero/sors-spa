import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Incident} from 'src/app/_models/incident';
import {ActivatedRoute} from '@angular/router';
import {AlertifyService} from 'src/app/_services/alertify.service';
import {IncidentService} from 'src/app/_services/incident.service';
import {PaginatedResult, Pagination} from 'src/app/_models/pagination';

@Component({
  selector: 'app-incident-list',
  templateUrl: './incident-list.component.html',
  styleUrls: ['./incident-list.component.css']
})
export class IncidentListComponent implements OnInit {
  filterForm: FormGroup;
  incidents: Incident[];
  pagination: Pagination;
  incidentParams: any = {};
  orderOptions: string[] = ['Дата', 'Описание', 'Статус'];
  currentOrder: string;
  isFiltered = false;

  constructor(private route: ActivatedRoute,
              private fb: FormBuilder,
              private alertify: AlertifyService,
              private incidentService: IncidentService) {
  }

  ngOnInit() {
    this.createFilterForm();
    this.incidentParams.order = 'dateIncident';
    this.incidentParams.orderAsc = true;
    this.currentOrder = 'Дата';
    this.route.data.subscribe(data => {
      this.incidents = data['incidents'].result;
      this.pagination = data['incidents'].pagination;
    });
  }

  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadIncidents();
  }

  loadIncidents() {
    this.incidentService
      .getIncidents(this.pagination.currentPage, this.pagination.itemsPerPage, this.incidentParams)
      .subscribe((res: PaginatedResult<Incident[]>) => {
        this.incidents = res.result;
        this.pagination = res.pagination;
      }, error => {
        console.log(error);
        this.alertify.error('ошибка получения данных');
      });
  }

  sort(currentOrder: string) {
    this.currentOrder = currentOrder;
    switch (currentOrder) {
      case 'Дата':
        this.incidentParams.order = 'dateIncident';
        break;
      case 'Описание':
        this.incidentParams.order = 'description';
        break;
      case 'Статус':
        this.incidentParams.order = 'status';
        break;
    }
    this.loadIncidents();
  }

  sortOrder(order: boolean) {
    this.incidentParams.orderAsc = order;
    this.loadIncidents();
  }

  createFilterForm() {
    this.filterForm = this.fb.group({
      filterString: ['', [Validators.minLength(3), Validators.maxLength(50)]]
    });
  }

  filter() {
    const filterValue = this.filterForm.get('filterString').value;
    this.incidentParams = {};
    this.incidentParams.filter = filterValue;
    this.loadIncidents();
    this.isFiltered = true;
  }

  unFilter() {
    this.filterForm.patchValue({filterString: ''});
    this.incidentParams = {};
    this.loadIncidents();
    this.isFiltered = false;
  }
}
