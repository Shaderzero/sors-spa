import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Department } from 'src/app/_models/department';
import { AdminService } from 'src/app/_services/admin.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { BsModalRef } from 'ngx-bootstrap';

@Component({
  selector: 'app-department-modal',
  templateUrl: './department-modal.component.html',
  styleUrls: ['./department-modal.component.css']
})
export class DepartmentModalComponent implements OnInit {
  modalForm: FormGroup;
  title: string;
  buttonName: string;
  editMode: boolean;
  department: Department;
  departments: Department[];
  @Output() reload = new EventEmitter();

  constructor(public modalRef: BsModalRef, private fb: FormBuilder,
    private adminService: AdminService, private alertify: AlertifyService) { }

  ngOnInit() {
    this.createModalForm();
  }

  createModalForm() {
    this.modalForm = this.fb.group({
      code: [this.department.code, [Validators.required, Validators.min(2076000000), Validators.max(2076999999)]],
      shortName: [this.department.shortName, [Validators.required, Validators.maxLength(10)]],
      name: [this.department.name, [Validators.required, Validators.maxLength(200)]]});
  }

  ok() {
    if (this.editMode) {
      const id = this.department.id;
      this.department = Object.assign({}, this.modalForm.value);
      this.department.id = id;
      if (this.checkUniqie()) {
        this.updateDepartment();
        this.modalRef.hide();
      }
    } else {
      this.department = Object.assign({}, this.modalForm.value);
      if (this.checkUniqie()) {
        this.createDepartment();
        this.modalRef.hide();
      }
    }
  }

  checkUniqie() {
    if (this.departments === null) {
      return true;
    } else {
      for (let i = 0; i < this.departments.length; i++) {
        const dep = this.departments[i];
        if (+this.department.code === +dep.code && this.department.id !== dep.id) {
          this.alertify.error('Данный код уже используется для подразделения (' + dep.code + ') ' + dep.name);
          return false;
        }
        if (this.department.name === dep.name && this.department.id !== dep.id) {
          this.alertify.error('Данное наименование уже используется для подразделения (' + dep.code + ') ' + dep.name);
          return false;
        }
        if (this.department.shortName === dep.shortName && this.department.id !== dep.id) {
          this.alertify.error('Данное краткое наименование уже используется для подразделения (' + dep.code + ') ' + dep.name);
          return false;
        }
      }
      return true;
    }
  }

  createDepartment() {
    this.adminService.createDepartment(this.department).subscribe((department: Department) => {
      this.reload.emit(department);
      this.alertify.success('Подразделение успешно создано');
    }, error => {
      console.log(error);
      this.alertify.error('ошибка создания подразделения');
    });
  }

  updateDepartment() {
    this.adminService.updateDepartment(this.department).subscribe((department: Department) => {
      this.reload.emit(department);
      this.alertify.success('Подразделение успешно обновлено');
    }, error => {
      console.log(error);
      this.alertify.error('ошибка обновления подразделения');
    });
  }
}
