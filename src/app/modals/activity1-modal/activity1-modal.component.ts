import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap';
import { AlertifyService } from 'src/app/_services/alertify.service';
import {ActivityType} from '../../_models/references/activity-type';
import {ReferenceService} from '../../_services/reference.service';

@Component({
  selector: 'app-activity1-modal',
  templateUrl: './activity1-modal.component.html',
  styleUrls: ['./activity1-modal.component.css']
})
export class Activity1ModalComponent implements OnInit {
  activityForm: FormGroup;
  title: string;
  buttonName: string;
  editMode: boolean;
  activity: ActivityType;
  activities: ActivityType[];
  @Output() reload = new EventEmitter();

  constructor(public modalRef: BsModalRef, private fb: FormBuilder,
    private refService: ReferenceService, private alertify: AlertifyService) { }

  ngOnInit() {
    this.createActivityForm();
  }

  createActivityForm() {
    this.activityForm = this.fb.group({
      code: [this.activity.code, [Validators.required, Validators.min(0), Validators.max(9999)]],
      name: [this.activity.name, [Validators.required, Validators.maxLength(200)]]});
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
    if (this.activities === null) {
      return true;
    } else {
      for (let i = 0; i < this.activities.length; i++) {
        const activity1 = this.activities[i];
        if (+this.activity.code === +activity1.code && this.activity.id !== activity1.id) {
          this.alertify.error('Данный код уже используется для вида деятельности (' + activity1.code + ') ' + activity1.name);
          return false;
        }
        if (this.activity.name === activity1.name && this.activity.id !== activity1.id) {
          this.alertify.error('Данное наименование уже используется для вида деятельности (' + activity1.code + ') ' + activity1.name);
          return false;
        }
        if (activity1.children) {
          for (let ii = 0; ii < activity1.children.length; ii++) {
            const acitivty2 = activity1.children[ii];
            if (+this.activity.code === +acitivty2.code) {
              this.alertify.error('Данный код уже используется для вида деятельности (' + acitivty2.code + ') ' + acitivty2.name);
              return false;
            }
            if (acitivty2.children) {
              for (let iii = 0; iii < acitivty2.children.length; iii++) {
                const activity3 = acitivty2.children[iii];
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
  }

  createActivity() {
    this.refService.createActivityType(this.activity).subscribe((activity: ActivityType) => {
      this.reload.emit(true);
      this.alertify.success('Вид деятельности успешно создан');
    }, error => {
      console.log(error);
      this.alertify.error('ошибка создания вида деятельности');
    });
  }

  updateActivity() {
    this.refService.updateActivityType(this.activity).subscribe((activity: ActivityType) => {
      this.reload.emit(true);
      this.alertify.success('Вид деятельности успешно обновлен');
    }, error => {
      console.log(error);
      this.alertify.error('ошибка обновления вида деятельности');
    });
  }
}
