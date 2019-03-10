import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {BsModalRef} from 'ngx-bootstrap';
import {DraftService} from '../../_services/draft.service';
import {AlertifyService} from '../../_services/alertify.service';
import {UserService} from '../../_services/user.service';
import {Department} from '../../_models/department';
import {Responsible} from '../../_models/responsible';

@Component({
  selector: 'app-incident-responsible-modal',
  templateUrl: './incident-responsible-modal.component.html',
  styleUrls: ['./incident-responsible-modal.component.css']
})
export class IncidentResponsibleModalComponent implements OnInit {
  departments: Department[];
  selectedResponsibles: Responsible[];
  @Output() outputDepartments = new EventEmitter();

  constructor(public modalRef: BsModalRef,
              private draftService: DraftService,
              private userService: UserService,
              private alertify: AlertifyService) {
  }

  ngOnInit() {
    this.getDepartments();
  }

  getDepartments() {
    this.userService.getDepartments().subscribe((res: Department[]) => {
      this.departments = res;
      this.mergeSelection();
    }, error => {
      console.log(error);
      this.alertify.error('Ошибка получения данных');
    });
  }

  mergeSelection() {
    if (this.selectedResponsibles.length === 0) {
      return;
    }
    for (let i = 0; i < this.departments.length; i++) {
      const dep = this.departments[i];
      for (let ii = 0; ii < this.selectedResponsibles.length; ii++) {
        const selDep = this.selectedResponsibles[ii].department;
        if (+dep.id === +selDep.id) {
          this.departments.splice(i, 1);
          i--;
          break;
        }
      }
    }
  }

  cancel() {
    this.modalRef.hide();
    this.alertify.message('отмена');
  }

  ok() {
    const selectedDepartments: Department[] = [];
    if (this.departments.length > 0) {
      for (let i = 0; i < this.departments.length; i++) {
        const department = this.departments[i];
        if (department.checked) {
          selectedDepartments.push(department);
        }
      }
    }
    this.outputDepartments.emit(selectedDepartments);
    this.modalRef.hide();
  }

}
