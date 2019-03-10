import {Component, OnInit, Input} from '@angular/core';
import {Measure} from 'src/app/_models/measure';
import {Report} from 'src/app/_models/report';
import {AlertifyService} from 'src/app/_services/alertify.service';
import {BsModalService, BsModalRef} from 'ngx-bootstrap';
import {ReportService} from 'src/app/_services/report.service';
import {ReportNewModalComponent} from '../report-new-modal/report-new-modal.component';
import {ConfirmModalComponent} from 'src/app/references/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-report-info',
  templateUrl: './report-info.component.html',
  styleUrls: ['./report-info.component.css']
})
export class ReportInfoComponent implements OnInit {
  @Input() measure: Measure;
  @Input() canEdit: boolean;
  @Input() canSign: boolean;
  modalRef: BsModalRef;
  reports: Report[] = [];

  constructor(private reportService: ReportService,
              private alertify: AlertifyService,
              private modalService: BsModalService) {
  }

  ngOnInit() {
    this.getReports();
  }

  getReports() {
    this.reportService.getReports(this.measure.id).subscribe((res: Report[]) => {
      this.reports = res;
    }, error => {
      console.log(error);
      this.alertify.error('ошибка получения данных');
    });
  }

  createReport() {
    const initialState = {
      title: 'Создание отчёта',
      buttonName: 'Создать',
      report: {
        id: 0,
        description: '',
        status: 'check',
        measureId: this.measure.id
      }
    };
    this.modalRef = this.modalService.show(ReportNewModalComponent, {ignoreBackdropClick: true, initialState});
    this.modalRef.content.outputReport.subscribe((res: Report) => {
      this.reportService.createReport(res).subscribe((newReport: Report) => {
        this.reports.push(newReport);
        this.alertify.success('Создан новый отчёт');
      }, error => {
        console.log(error);
        this.alertify.error('ошибка создания отчёта');
      });
    });
  }

  createReportDELETE(report: Report) {
    const initialState = {
      title: 'Создать новый отчёт?',
      text: 'Описание: ' + report.description
    };
    this.modalRef = this.modalService.show(ConfirmModalComponent, {ignoreBackdropClick: true, initialState});
    this.modalRef.content.result.subscribe((res) => {
      if (res) {
        this.reportService.createReport(report).subscribe((newReport: Report) => {
          this.reports.push(newReport);
          this.alertify.success('Создан новый отчёт');
        }, error => {
          console.log(error);
          this.alertify.error('ошибка создания отчёта');
        });
      }
    });
  }

  editReport(report: Report) {
    const initialState = {
      title: 'Редактирование отчёта',
      buttonName: 'Сохранить',
      report: report
    };
    this.modalRef = this.modalService.show(ReportNewModalComponent, {ignoreBackdropClick: true, initialState});
    this.modalRef.content.outputReport.subscribe((res: Report) => {
      this.reportService.updateReport(res).subscribe((updatedReport: Report) => {
        for (let i = 0; i < this.reports.length; i++) {
          if (+this.reports[i].id === +updatedReport.id) {
            this.reports[i] = updatedReport;
            this.alertify.success('Отчёт изменён');
            break;
          }
        }
      }, error => {
        console.log(error);
        this.alertify.error('ошибка изменения отчёта');
      });
    });
  }

  editReportDELETE(report: Report) {
    const initialState = {
      title: 'Сохранить изменения в отчёте?',
      text: 'Описание: ' + report.description
    };
    this.modalRef = this.modalService.show(ConfirmModalComponent, {ignoreBackdropClick: true, initialState});
    this.modalRef.content.result.subscribe((res) => {
      if (res) {
        this.reportService.updateReport(report).subscribe((updatedReport: Report) => {
          for (let i = 0; i < this.reports.length; i++) {
            if (+this.reports[i].id === +updatedReport.id) {
              this.reports[i] = updatedReport;
              this.alertify.success('Отчёт изменён');
              break;
            }
          }
        }, error => {
          console.log(error);
          this.alertify.error('ошибка изменения отчёта');
        });
      }
    });
  }

  removeReport(report: Report) {
    const initialState = {
      title: 'Удалить отчёт?',
      text: 'Описание: ' + report.description
    };
    this.modalRef = this.modalService.show(ConfirmModalComponent, {ignoreBackdropClick: true, initialState});
    this.modalRef.content.result.subscribe((res) => {
      if (res) {
        this.reportService.deleteReport(+report.id).subscribe(() => {
          for (let i = 0; i < this.reports.length; i++) {
            if (+this.reports[i].id === +report.id) {
              this.reports.splice(i, 1);
              this.alertify.success('Отчёт удален');
            }
          }
        }, error => {
          this.alertify.error(error);
        });
      }
    });
  }

  sign(report: Report) {
    const patcher = [
      {
        'propertyName': 'Status',
        'propertyValue': 'sign'
      }
    ];
    this.reportService.signReport(report.id, patcher).subscribe(() => {
      this.alertify.success('Отчёт подписан');
      report.status = 'sign';
    }, error => {
      this.alertify.error(error);
    });
  }

  unSign(report: Report) {
    const patcher = [
      {
        'propertyName': 'Status',
        'propertyValue': 'check'
      }
    ];
    this.reportService.signReport(report.id, patcher).subscribe(() => {
      this.alertify.success('Отчёт отозван');
      report.status = 'check';
    }, error => {
      this.alertify.error(error);
    });
  }

}
