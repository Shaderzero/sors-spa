import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DomainDepartment } from 'src/app/_models/domainDepartment';
import { Department } from 'src/app/_models/department';
import { BsModalRef, TypeaheadMatch } from 'ngx-bootstrap';
import { AdminService } from 'src/app/_services/admin.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { DomainUser } from 'src/app/_models/domainUser';

@Component({
  selector: 'app-domain-department-modal',
  templateUrl: './domain-department-modal.component.html',
  styleUrls: ['./domain-department-modal.component.css']
})
export class DomainDepartmentModalComponent implements OnInit {
  modalForm: FormGroup;
  title: string;
  buttonName: string;
  editMode: boolean;
  domainUsers: DomainUser[];
  departments: Department[];
  domainDepartment: DomainDepartment;
  domainDepartments: DomainDepartment[];
  domainDepartmentList: string[] = [];
  @Output() reload = new EventEmitter();

  constructor(public modalRef: BsModalRef, private fb: FormBuilder,
    private adminService: AdminService, private alertify: AlertifyService) { }

  ngOnInit() {
    this.createDomainDepartmentList();
    this.createModalForm();
  }

  createModalForm() {
    this.modalForm = this.fb.group({
      domainDepartment: [this.domainDepartment.name, [Validators.required]],
      department: [this.domainDepartment.department.name, [Validators.required]]
    });
  }

  createDomainDepartmentList() {
    for (let i = 0; i < this.domainUsers.length; i++) {
      const dep = this.domainUsers[i].domainDepartment;
      this.domainDepartmentList.push(dep);
    }
    const distinct = (value, index, self) => {
      return self.indexOf(value) === index;
    };
    this.domainDepartmentList = this.domainDepartmentList.filter(distinct);
  }

  ok() {
    if (this.editMode) {
      if (this.checkUniqie()) {
        this.updateDomainDepartment();
        this.modalRef.hide();
      }
    } else {
      if (this.checkUniqie()) {
        this.createDomainDepartment();
        this.modalRef.hide();
      }
    }
  }

  onSelectDepartment(event: TypeaheadMatch): void {
    this.domainDepartment.department = event.item;
  }

  onSelectDomainDepartment(event: TypeaheadMatch): void {
    this.domainDepartment.name = event.item;
  }

  checkUniqie() {
    if (this.domainDepartments === null) {
      return true;
    } else {
      for (let i = 0; i < this.domainDepartments.length; i++) {
        const dep = this.domainDepartments[i];
        if (this.domainDepartment.name === dep.name) {
          this.alertify.error('Данное наименование уже используется для подразделения (' + dep.name + ') ' + dep.department.name);
          return false;
        }
      }
      return true;
    }
  }

  createDomainDepartment() {
    this.adminService.createDomainDepartment(this.domainDepartment).subscribe((domainDepartment: DomainDepartment) => {
      this.reload.emit(domainDepartment);
      this.alertify.success('Подразделение успешно создано');
    }, error => {
      console.log(error);
      this.alertify.error('ошибка создания подразделения');
    });
  }

  updateDomainDepartment() {
    this.adminService.updateDomainDepartment(this.domainDepartment).subscribe((domainDepartment: DomainDepartment) => {
      this.reload.emit(domainDepartment);
      this.alertify.success('Подразделение успешно обновлено');
    }, error => {
      console.log(error);
      this.alertify.error('ошибка обновления подразделения');
    });
  }
}
