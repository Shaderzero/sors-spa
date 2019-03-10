import {Component, OnInit} from '@angular/core';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {ActivatedRoute, Router} from '@angular/router';
import {AlertifyService} from 'src/app/_services/alertify.service';
import {Activity1ModalComponent} from '../../modals/activity1-modal/activity1-modal.component';
import {Activity2ModalComponent} from '../../modals/activity2-modal/activity2-modal.component';
import {Activity3ModalComponent} from '../../modals/activity3-modal/activity3-modal.component';
import {ActivityType} from '../../_models/references/activity-type';
import {ConfirmModalComponent} from '../../references/confirm-modal/confirm-modal.component';
import {ReferenceService} from '../../_services/reference.service';

@Component({
  selector: 'app-activitytype-table',
  templateUrl: './activitytype-table.component.html',
  styleUrls: ['./activitytype-table.component.css']
})
export class ActivitytypeTableComponent implements OnInit {
  activityTypes: ActivityType[];
  activityTable: any[];
  modalRef: BsModalRef;

  constructor(private route: ActivatedRoute, private refService: ReferenceService,
              private alertify: AlertifyService,
              private modalService: BsModalService,
              public router: Router) {
  }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.activityTypes = data['activityTypes'];
    });
    this.createTableList();
  }

  reload() {
    this.refService.getActivityTypes().subscribe(res => {
      this.activityTypes = res;
      this.createTableList();
    });
  }

  createTableList() {
    this.activityTable = [];
    this.activityTypes.forEach(element => {
      const activity1 = {
        id: element.id,
        activity1Id: element.id,
        code: element.code,
        activity1: element.name
      };
      this.activityTable.push(activity1);
      if (element.children) {
        element.children.forEach(child1 => {
          const activity2 = {
            id: child1.id,
            activity2Id: child1.id,
            activity1Id: element.id,
            code: child1.code,
            activity1: element.name,
            activity2: child1.name
          };
          this.activityTable.push(activity2);
          if (child1.children) {
            child1.children.forEach(child2 => {
              const activity3 = {
                id: child2.id,
                activity1Id: element.id,
                activity2Id: child1.id,
                activity3Id: child2.id,
                code: child2.code,
                activity1: element.name,
                activity2: child1.name,
                activity3: child2.name
              };
              this.activityTable.push(activity3);
            });
          }
        });
      }
    });
    this.activityTable.sort((a, b) => (a.code > b.code) ? 1 : ((b.code > a.code) ? -1 : 0));
  }

  newActivity1() {
    const initialState = {
      title: 'Создание вида деятельности 1',
      buttonName: 'Создать',
      activities: this.activityTypes,
      editMode: false,
      activity: {
        code: 1000,
        name: ''
      }
    };
    this.modalRef = this.modalService.show(Activity1ModalComponent, {initialState});
    this.modalRef.content.reload.subscribe(result => {
      if (result) {
        this.reload();
      }
    });
  }

  editActivity1(activity1Id: number) {
    let activity1: ActivityType;
    this.activityTypes.forEach(el => {
      if (el.id === activity1Id) {
        activity1 = el;
      }
    });
    const initialState = {
      title: 'Редактирование вида деятельности 1',
      buttonName: 'Сохранить',
      activities: this.activityTypes,
      editMode: true,
      activity: activity1
    };
    this.modalRef = this.modalService.show(Activity1ModalComponent, {initialState});
    this.modalRef.content.reload.subscribe(result => {
      if (result) {
        this.reload();
      }
    });
  }

  newActivity2() {
    const initialState = {
      title: 'Создание вида деятельности 2',
      buttonName: 'Создать',
      editMode: false,
      activities: this.activityTypes,
      activity: {
        code: 1000,
        parentId: '',
        name: ''
      }
    };
    this.modalRef = this.modalService.show(Activity2ModalComponent, {initialState});
    this.modalRef.content.reload.subscribe(result => {
      if (result) {
        this.reload();
      }
    });
  }

  editActivity2(activity2Id: number) {
    let activity2: ActivityType;
    this.refService.getActivityType(activity2Id).subscribe((res: ActivityType) => {
      activity2 = res;
      const initialState = {
        title: 'Редактирование вида деятельности 2',
        buttonName: 'Сохранить',
        editMode: true,
        activities: this.activityTypes,
        activity: activity2
      };
      this.modalRef = this.modalService.show(Activity2ModalComponent, {initialState});
      this.modalRef.content.reload.subscribe(result => {
        if (result) {
          this.reload();
        }
      });
    });
  }

  newActivity3() {
    const initialState = {
      title: 'Создание вида деятельности 3',
      buttonName: 'Создать',
      editMode: false,
      activities: this.activityTypes,
      activity: {
        code: 1000,
        parentId: '',
        name: '',
        parent: {
          parentId: ''
        }
      }
    };
    this.modalRef = this.modalService.show(Activity3ModalComponent, {initialState});
    this.modalRef.content.reload.subscribe(result => {
      if (result) {
        this.reload();
      }
    });
  }

  editActivity3(activity3Id: number) {
    let activity3: ActivityType;
    this.refService.getActivityType(activity3Id).subscribe((res: ActivityType) => {
      activity3 = res;
      const initialState = {
        title: 'Редактирование вида деятельности 3',
        buttonName: 'Сохранить',
        editMode: true,
        activities: this.activityTypes,
        activity: activity3
      };
      this.modalRef = this.modalService.show(Activity3ModalComponent, {initialState});
      this.modalRef.content.reload.subscribe(result => {
        if (result) {
          this.reload();
        }
      });
    });
  }

  deleteActivityType(activity: any) {
    let name = activity.activity1;
    if (activity.activity2) {
      name = name + ' ' + activity.activity2;
    }
    if (activity.activity3) {
      name = name + ' ' + activity.activity3;
    }
    const initialState = {
      title: 'Удалить вид деятельности?',
      text: 'Удаление вида деятельности ' + name
    };
    this.modalRef = this.modalService.show(ConfirmModalComponent, {ignoreBackdropClick: true, initialState});
    this.modalRef.content.result.subscribe((res: boolean) => {
      if (res) {
        this.refService.deleteActivityType(activity.id).subscribe(() => {
          for (let i = 0; i < this.activityTypes.length; i++) {
            if (+this.activityTypes[i].id === +activity.id) {
              this.activityTypes.splice(i, 1);
              this.createTableList();
              this.alertify.success('Вид деятельности удалён');
              break;
            }
          }
        }, error => {
          console.log(error);
          this.alertify.error('Ошибка удаления вида деятельности');
        });
      } else {
        this.alertify.message('Отмена');
      }
    });
  }

}
