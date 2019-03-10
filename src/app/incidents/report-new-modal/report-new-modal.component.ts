import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {Report} from 'src/app/_models/report';
import {BsModalRef, BsLocaleService} from 'ngx-bootstrap';
import {AlertifyService} from 'src/app/_services/alertify.service';
import {AuthService} from '../../_services/auth.service';

@Component({
  selector: 'app-report-new-modal',
  templateUrl: './report-new-modal.component.html',
  styleUrls: ['./report-new-modal.component.css']
})
export class ReportNewModalComponent implements OnInit {
  reportForm: FormGroup;
  title: string;
  buttonName: string;
  report: Report;
  @Output() outputReport = new EventEmitter();

  constructor(public modalRef: BsModalRef,
              private fb: FormBuilder,
              private authService: AuthService) {
  }

  ngOnInit() {
    this.createMeasureForm();
  }

  createMeasureForm() {
    this.reportForm = this.fb.group({
      description: [this.report.description, [Validators.required, Validators.maxLength(1000)]]
    });
  }

  ok() {
    this.report.description = this.reportForm.get('description').value;
    this.report.authorId = this.authService.currentUser.id;
    this.outputReport.emit(this.report);
    this.modalRef.hide();
  }

}
