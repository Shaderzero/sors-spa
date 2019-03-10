import { Component, OnInit } from '@angular/core';
import { Draft } from 'src/app/_models/draft';
import {ActivatedRoute, NavigationEnd, Router, RoutesRecognized} from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { BsModalRef } from 'ngx-bootstrap';
import { Pagination, PaginatedResult } from 'src/app/_models/pagination';
import { DraftService } from 'src/app/_services/draft.service';
import {filter, map} from 'rxjs/operators';

@Component({
  selector: 'app-draft-list',
  templateUrl: './draft-list.component.html',
  styleUrls: ['./draft-list.component.css']
})
export class DraftListComponent implements OnInit {
  filterForm: FormGroup;
  modalRef: BsModalRef;
  drafts: Draft[];
  pagination: Pagination;
  draftParams: any = {};
  orderOptions: string[] = ['Дата', 'Наименование', 'Описание', 'Автор', 'Подразделение', 'Статус'];
  currentOrder: string;
  isFiltered = false;

  constructor(private route: ActivatedRoute,
              private fb: FormBuilder,
              private draftService: DraftService,
              private alertify: AlertifyService) { }

  ngOnInit() {
    this.createFilterForm();
    this.draftParams.order = 'dateCreate';
    this.draftParams.orderAsc = true;
    this.draftParams.status = this.route.snapshot.data['status'];
    this.currentOrder = 'Дата';
    this.route.data.subscribe(data => {
      this.drafts = data['drafts'].result;
      this.pagination = data['drafts'].pagination;
    });
  }

  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadDrafts();
  }

  loadDrafts() {
    this.draftService
      .getDrafts(this.pagination.currentPage, this.pagination.itemsPerPage, this.draftParams)
      .subscribe((res: PaginatedResult<Draft[]>) => {
      this.drafts = res.result;
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
        this.draftParams.order = 'dateCreate';
        break;
      case 'Наименование':
        this.draftParams.order = 'description1';
        break;
      case 'Описание':
        this.draftParams.order = 'description2';
        break;
      case 'Автор':
        this.draftParams.order = 'author';
        break;
      case 'Подразделение':
        this.draftParams.order = 'department';
        break;
      case 'Статус':
        this.draftParams.order = 'status';
        break;
    }
    this.loadDrafts();
  }

  sortOrder(order: boolean) {
    this.draftParams.orderAsc = order;
    this.loadDrafts();
  }

  createFilterForm() {
    this.filterForm = this.fb.group({
      filterString: ['', [Validators.minLength(3), Validators.maxLength(50)]]});
  }

  filter() {
    const filterValue = this.filterForm.get('filterString').value;
    this.pagination.currentPage = 1;
    this.draftParams.filter = filterValue;
    this.loadDrafts();
    this.isFiltered = true;
  }

  filterStatus(status: string) {
    this.pagination.currentPage = 1;
    this.draftParams.status = status;
    this.loadDrafts();
  }

  unFilter() {
    this.filterForm.patchValue({filterString: ''});
    this.draftParams.filter = '';
    this.loadDrafts();
    this.isFiltered = false;
  }
}
