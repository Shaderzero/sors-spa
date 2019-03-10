import {Component, OnInit} from '@angular/core';
import {BusinessProcess} from 'src/app/_models/references/BusinessProcess';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {ActivatedRoute, Router} from '@angular/router';
import {AlertifyService} from 'src/app/_services/alertify.service';
import {BP1ModalComponent} from '../../modals/bp1-modal/BP1-modal.component';
import {BP2ModalComponent} from '../../modals/bp2-modal/BP2-modal.component';
import {BP3ModalComponent} from '../../modals/bp3-modal/BP3-modal.component';
import {BP4ModalComponent} from '../../modals/bp4-modal/BP4-modal.component';
import {ReferenceService} from '../../_services/reference.service';
import {ConfirmModalComponent} from '../../references/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-bp-table',
  templateUrl: './bp-table.component.html',
  styleUrls: ['./bp-table.component.css']
})
export class BpTableComponent implements OnInit {
  bps: BusinessProcess[];
  bpTable: any[];
  modalRef: BsModalRef;

  constructor(private route: ActivatedRoute, private refService: ReferenceService,
              private alertify: AlertifyService,
              private modalService: BsModalService,
              public router: Router) {
  }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.bps = data['bps'];
    });
    this.createTableList();
  }

  reload() {
    this.refService.getBusinessProcesses().subscribe(res => {
      this.bps = res;
      this.createTableList();
    });
  }

  createTableList() {
    this.bpTable = [];
    this.bps.forEach(element => {
      const bp1 = {
        id: element.id,
        bp1Id: element.id,
        code: element.code,
        bp1: element.name
      };
      this.bpTable.push(bp1);
      if (element.children) {
        element.children.forEach(child1 => {
          const bp2 = {
            id: child1.id,
            bp2Id: child1.id,
            bp1Id: element.id,
            code: child1.code,
            bp1: element.name,
            bp2: child1.name
          };
          this.bpTable.push(bp2);
          if (child1.children) {
            child1.children.forEach(child2 => {
              const bp3 = {
                id: child2.id,
                bp1Id: element.id,
                bp2Id: child1.id,
                bp3Id: child2.id,
                code: child2.code,
                bp1: element.name,
                bp2: child1.name,
                bp3: child2.name
              };
              this.bpTable.push(bp3);
              if (child2.children) {
                child2.children.forEach(child3 => {
                  const bp4 = {
                    id: child3.id,
                    bp1Id: element.id,
                    bp2Id: child1.id,
                    bp3Id: child2.id,
                    bp4Id: child3.id,
                    code: child3.code,
                    bp1: element.name,
                    bp2: child1.name,
                    bp3: child2.name,
                    bp4: child3.name
                  };
                  this.bpTable.push(bp4);
                });
              }
            });
          }
        });
      }
    });
    this.bpTable.sort((a, b) => (a.code > b.code) ? 1 : ((b.code > a.code) ? -1 : 0));
  }

  newBP1() {
    const initialState = {
      title: 'Создание бизнес процесса 1',
      buttonName: 'Создать',
      bps: this.bps,
      editMode: false,
      bp: {
        code: 10000,
        name: ''
      }
    };
    this.modalRef = this.modalService.show(BP1ModalComponent, {initialState});
    this.modalRef.content.reload.subscribe(result => {
      if (result) {
        this.reload();
      }
    });
  }

  editBP1(bp1Id: number) {
    let bp1: BusinessProcess;
    this.bps.forEach(el => {
      if (el.id === bp1Id) {
        bp1 = el;
      }
    });
    const initialState = {
      title: 'Редактирование бизнес процесса 1',
      buttonName: 'Сохранить',
      bps: this.bps,
      editMode: true,
      bp: bp1
    };
    this.modalRef = this.modalService.show(BP1ModalComponent, {initialState});
    this.modalRef.content.reload.subscribe(result => {
      if (result) {
        this.reload();
      }
    });
  }

  newBP2() {
    const initialState = {
      title: 'Создание бизнес процесса 2',
      buttonName: 'Создать',
      editMode: false,
      bps: this.bps,
      bp: {
        code: 10000,
        parentId: '',
        name: ''
      }
    };
    this.modalRef = this.modalService.show(BP2ModalComponent, {initialState});
    this.modalRef.content.reload.subscribe(result => {
      if (result) {
        this.reload();
      }
    });
  }

  editBP2(bp2Id: number) {
    let bp2: BusinessProcess;
    this.refService.getBusinessProcess(bp2Id).subscribe((res: BusinessProcess) => {
      bp2 = res;
      const initialState = {
        title: 'Редактирование бизнес процесса 2',
        buttonName: 'Сохранить',
        editMode: true,
        bps: this.bps,
        bp: bp2
      };
      this.modalRef = this.modalService.show(BP2ModalComponent, {initialState});
      this.modalRef.content.reload.subscribe(result => {
        if (result) {
          this.reload();
        }
      });
    });
  }

  newBP3() {
    const initialState = {
      title: 'Создание бизнес процесса 3',
      buttonName: 'Создать',
      editMode: false,
      bps: this.bps,
      bp: {
        code: 10000,
        parentId: '',
        name: '',
        parent: {
          parentId: ''
        }
      }
    };
    this.modalRef = this.modalService.show(BP3ModalComponent, {initialState});
    this.modalRef.content.reload.subscribe(result => {
      if (result) {
        this.reload();
      }
    });
  }

  editBP3(bp3Id: number) {
    let bp3: BusinessProcess;
    this.refService.getBusinessProcess(bp3Id).subscribe((res: BusinessProcess) => {
      bp3 = res;
      const initialState = {
        title: 'Редактирование бизнес процесса 3',
        buttonName: 'Сохранить',
        editMode: true,
        bps: this.bps,
        bp: bp3
      };
      this.modalRef = this.modalService.show(BP3ModalComponent, {initialState});
      this.modalRef.content.reload.subscribe(result => {
        if (result) {
          this.reload();
        }
      });
    });
  }

  newBP4() {
    const initialState = {
      title: 'Создание бизнес процесса 4',
      buttonName: 'Создать',
      editMode: false,
      bps: this.bps,
      bp: {
        code: 10000,
        parentId: '',
        name: '',
        parent: {
          parentId: '',
          parent: {
            parentId: ''
          }
        }
      }
    };
    this.modalRef = this.modalService.show(BP4ModalComponent, {initialState});
    this.modalRef.content.reload.subscribe(result => {
      if (result) {
        this.reload();
      }
    });
  }

  editBP4(bp4Id: number) {
    let bp4: BusinessProcess;
    this.refService.getBusinessProcess(bp4Id).subscribe((res: BusinessProcess) => {
      bp4 = res;
      const initialState = {
        title: 'Редактирование бизнес процесса 4',
        buttonName: 'Сохранить',
        editMode: true,
        bps: this.bps,
        bp: bp4
      };
      this.modalRef = this.modalService.show(BP4ModalComponent, {initialState});
      this.modalRef.content.reload.subscribe(result => {
        if (result) {
          this.reload();
        }
      });
    });
  }

  deleteBP(bpId: number) {
    const initialState = {
      title: 'Удаление бизнес процесса',
      text: 'Удалить бизнес процесс?'
    };
    this.modalRef = this.modalService.show(ConfirmModalComponent, {ignoreBackdropClick: true, initialState});
    this.modalRef.content.result.subscribe((res: boolean) => {
      if (res) {
        this.refService.deleteBusinessProcess(bpId).subscribe(() => {
          this.alertify.success('Бизнес процесс удален');
          this.reload();
        }, error => {
          console.log(error);
          this.alertify.error('Ошибка удаления бизнес процесса');
        });
      } else {
        this.alertify.message('Отмена');
      }
    });
  }
}
