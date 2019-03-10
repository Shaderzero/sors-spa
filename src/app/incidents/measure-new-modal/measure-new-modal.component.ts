import { Component, OnInit, Output, EventEmitter, OnChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Measure } from 'src/app/_models/measure';
import { BsModalRef, BsLocaleService } from 'ngx-bootstrap';
import { AlertifyService } from 'src/app/_services/alertify.service';

@Component({
  selector: 'app-measure-new-modal',
  templateUrl: './measure-new-modal.component.html',
  styleUrls: ['./measure-new-modal.component.css']
})
export class MeasureNewModalComponent implements OnInit {
  model: any = {};
  measureForm: FormGroup;
  title: string;
  buttonName: string;
  measure: Measure;
  measures: Measure[];
  @Output() outputMeasure = new EventEmitter();

  constructor(public modalRef: BsModalRef,
              private fb: FormBuilder,
              private alertify: AlertifyService,
              private localeService: BsLocaleService) { }

  ngOnInit() {
    this.localeService.use('ru');
    this.createMeasureForm();
  }

  createMeasureForm() {
    this.measureForm = this.fb.group({
      description: [this.measure.description, [Validators.required, Validators.maxLength(1000)]],
      expectedResult: [this.measure.expectedResult, [Validators.maxLength(1000)]],
      deadLine: [this.measure.deadLine],
      deadLineString: [this.measure.deadLineText, [Validators.maxLength(100)]]
    });
  }

  ok() {
      this.model = Object.assign({}, this.measureForm.value);
      this.measure.description = this.model.description;
      this.measure.expectedResult = this.model.expectedResult;
      this.measure.deadLine = this.model.deadLine;
      this.measure.deadLineText = this.model.deadLineString;
      this.measure.status = 'check';
      if (this.checkUniqie()) {
        this.outputMeasure.emit(this.measure);
        this.modalRef.hide();
      }
  }

  checkUniqie() {
    if (this.measures) {
      for (let i = 0; i < this.measures.length; i++) {
        const val = this.measures[i];
        if (this.measure.description === val.description && this.measure.id !== val.id) {
          this.alertify.error('Данное описание уже используется');
          return false;
        }
      }
    }
    return true;
  }
}
