import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap';
import { AlertifyService } from 'src/app/_services/alertify.service';
import {ActivityType} from '../../_models/references/activity-type';
import {ReferenceService} from '../../_services/reference.service';

@Component({
  selector: 'app-activity2-modal',
  templateUrl: './activity2-modal.component.html',
  styleUrls: ['./activity2-modal.component.css']
})
export class Activity2ModalComponent implements OnInit {
  activityForm: FormGroup;
  title: string;
  buttonName: string;
  editMode: boolean;
  activities1: ActivityType[] = [];
  activities: ActivityType[];
  activity: ActivityType;
  @Output() reload = new EventEmitter();

  constructor(public modalRef: BsModalRef, private fb: FormBuilder,
    private refService: ReferenceService, private alertify: AlertifyService) { }

  ngOnInit() {
    this.getActivities1();
    this.createActivityForm();
  }

  getActivities1() {
    this.activities.forEach(element => {
      if (!element.parent) {
        this.activities1.push(element);
      }
    });
  }

  createActivityForm() {
    this.activityForm = this.fb.group({
      code: [this.activity.code, [Validators.required, Validators.min(1000), Validators.max(9999)]],
      parentId: [this.activity.parentId, Validators.required],
      name: [this.activity.name, [Validators.required, Validators.maxLength(200)]]
    });
  }

  ok() {
    if (this.editMode) {
      const id = this.activity.id;
      this.activity = Object.assign({}, this.activityForm.value);
      this.activity.id = id;
      if (this.checkUniqie()) {
        this.updateActivity();
        this.modalRef.hide();
      }
    } else {
      this.activity = Object.assign({}, this.activityForm.value);
      if (this.checkUniqie()) {
        this.createActivity();
        this.modalRef.hide();
      }
    }
  }

  checkUniqie() {
    for (let i = 0; i < this.activities.length; i++) {
      const activity1 = this.activities[i];
      if (+this.activity.code === +activity1.code) {
        this.alertify.error('Данный код уже используется для вида деятельности (' + activity1.code + ') ' + activity1.name);
        return false;
      }
      if (activity1.children) {
        for (let ii = 0; ii < activity1.children.length; ii++) {
          const activity2 = activity1.children[ii];
          if (+this.activity.code === +activity2.code && this.activity.id !== activity2.id) {
            this.alertify.error('Данный код уже используется для фактора (' + activity2.code + ') ' + activity2.name);
            return false;
          }
          if (this.activity.name === activity2.name && this.activity.id !== activity2.id && this.activity.parentId === activity2.parentId) {
            this.alertify.error('Данное наименование уже используется для вида деятельности (' + activity2.code + ') ' + activity2.name);
            return false;
          }
          if (activity2.children) {
            for (let iii = 0; iii < activity2.children.length; iii++) {
              const activity3 = activity2.children[iii];
              if (+this.activity.code === +activity3.code) {
                this.alertify.error('Данный код уже используется для вида деятельности (' + activity3.code + ') ' + activity3.name);
                return false;
              }
            }
          }
        }
      }
    }
    return true;
  }

  createActivity() {
    this.refService.createActivityType(this.activity).subscribe((activity: ActivityType) => {
      this.reload.emit(activity);
      this.alertify.success('Вид деятельности успешно создан');
    }, error => {
      this.alertify.error('ошибка создания вида деятельности' + '\n' + error);
    });
  }

  updateActivity() {
    this.refService.updateActivityType(this.activity).subscribe((activity: ActivityType) => {
      this.reload.emit(activity);
      this.alertify.success('Вид деятельности успешно обновлен');
    }, error => {
      this.alertify.error('ошибка обновления вида деятельности' + '\n' + error);
    });
  }

  onChangeActivity1(activity1Id) {
    for (let i = 0; i < this.activities.length; i++) {
      if (this.activities[i].id === activity1Id) {
        this.activityForm.patchValue({code: this.activities[i].code});
      }
    }
  }
}
