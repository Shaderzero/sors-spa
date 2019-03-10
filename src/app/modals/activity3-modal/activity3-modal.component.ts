import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap';
import { AlertifyService } from 'src/app/_services/alertify.service';
import {ActivityType} from '../../_models/references/activity-type';
import {ReferenceService} from '../../_services/reference.service';

@Component({
  selector: 'app-activity3-modal',
  templateUrl: './activity3-modal.component.html',
  styleUrls: ['./activity3-modal.component.css']
})
export class Activity3ModalComponent implements OnInit {
  activityForm: FormGroup;
  title: string;
  buttonName: string;
  editMode: boolean;
  activities: ActivityType[];
  activities1: ActivityType[] = [];
  activities2: ActivityType[] = [];
  activity: ActivityType;
  @Output() reload = new EventEmitter();

  constructor(public modalRef: BsModalRef, private fb: FormBuilder,
    private refService: ReferenceService, private alertify: AlertifyService) { }

  ngOnInit() {
    this.fillActivities1();
    if (this.editMode) {
      this.patchActivities2(this.activity.parent.parentId);
    }
    this.createActivityForm();
  }

  fillActivities1() {
    for (let i = 0; i < this.activities.length; i++) {
      if (this.activities[i].parent === null) {
        this.activities1.push(this.activities[i]);
      }
    }
  }

  patchCode(activity2Id) {
    for (let i = 0; i < this.activities2.length; i++) {
      if (this.activities2[i].id === activity2Id) {
        this.activityForm.patchValue({code: this.activities2[i].code});
        break;
      }
    }
  }

  patchActivities2(activity1Id) {
    this.activities2.length = 0;
    for (let i = 0; i < this.activities1.length; i++) {
      if (this.activities1[i].id === activity1Id
          && this.activities1[i].children) {
        this.activities1[i].children.forEach(el => {
          this.activities2.push(el);
        });
        break;
      }
    }
  }

  createActivityForm() {
    this.activityForm = this.fb.group({
      code: [this.activity.code, [Validators.required, Validators.min(1000), Validators.max(9999)]],
      activity1Id: [this.activity.parent.parentId, Validators.required],
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
          if (+this.activity.code === +activity2.code) {
            this.alertify.error('Данный код уже используется для вида деятельности (' + activity2.code + ') ' + activity2.name);
            return false;
          }
          if (activity2.children) {
            for (let iii = 0; iii < activity2.children.length; iii++) {
              const activity3 = activity2.children[iii];
              if (+this.activity.code === +activity3.code && this.activity.id !== activity3.id) {
                this.alertify.error('Данный код уже используется для вида деятельности (' + activity3.code + ') ' + activity3.name);
                return false;
              }
              if (this.activity.name === activity3.name && this.activity.id !== activity3.id
                  && this.activity.parentId === activity3.parentId) {
                this.alertify.error('Данное наименование уже используется для ' +
                  'вида деятельности (' + activity3.code + ') ' + activity3.name);
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
      this.alertify.success('Вид деятельности успешно создан');
      this.reload.emit(activity);
    }, error => {
      this.alertify.error('ошибка создания вида деятельности ' + '\n' + error);
    });
  }

  updateActivity() {
    this.refService.updateActivityType(this.activity).subscribe((activity: ActivityType) => {
      this.alertify.success('Вид деятельности успешно обновлен');
      this.reload.emit(activity);
    }, error => {
      this.alertify.error('ошибка обновления вида деятельности ' + '\n' + error);
    });
  }
}
