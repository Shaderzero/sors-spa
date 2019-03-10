import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {BusinessProcess} from 'src/app/_models/references/businessProcess';
import {BsModalRef} from 'ngx-bootstrap';
import {AlertifyService} from 'src/app/_services/alertify.service';
import {ReferenceService} from '../../_services/reference.service';

@Component({
  selector: 'app-bp3-modal',
  templateUrl: './BP3-modal.component.html',
  styleUrls: ['./BP3-modal.component.css']
})
export class BP3ModalComponent implements OnInit {
  bpForm: FormGroup;
  buttonName: string;
  editMode: boolean;
  bps: BusinessProcess[];
  bps1: BusinessProcess[] = [];
  bps2: BusinessProcess[] = [];
  bp: BusinessProcess;
  @Output() reload = new EventEmitter();

  constructor(public modalRef: BsModalRef, private fb: FormBuilder,
              private refService: ReferenceService, private alertify: AlertifyService) {
  }

  ngOnInit() {
    this.fillBps1();
    if (this.editMode) {
      this.patchBps2(this.bp.parent.parentId);
    }
    this.createBpForm();
  }

  fillBps1() {
    for (let i = 0; i < this.bps.length; i++) {
      if (this.bps[i].parent === null) {
        this.bps1.push(this.bps[i]);
      }
    }
  }

  patchCode(bp2Id) {
    for (let i = 0; i < this.bps2.length; i++) {
      if (this.bps2[i].id === bp2Id) {
        this.bpForm.patchValue({code: this.bps2[i].code});
        break;
      }
    }
  }

  patchBps2(bp1Id) {
    this.bps2.length = 0;
    for (let i = 0; i < this.bps1.length; i++) {
      if (this.bps1[i].id === bp1Id
        && this.bps1[i].children) {
        this.bps1[i].children.forEach(el => {
          this.bps2.push(el);
        });
        break;
      }
    }
  }

  createBpForm() {
    this.bpForm = this.fb.group({
      code: [this.bp.code, [Validators.required, Validators.min(10000), Validators.max(320600)]],
      bp1Id: [this.bp.parent.parentId, Validators.required],
      parentId: [this.bp.parentId, Validators.required],
      name: [this.bp.name, [Validators.required, Validators.maxLength(200)]]
    });
  }

  ok() {
    if (this.editMode) {
      const id = this.bp.id;
      this.bp = Object.assign({}, this.bpForm.value);
      this.bp.id = id;
      if (this.checkUniqie()) {
        this.updateBP();
        this.modalRef.hide();
      }
    } else {
      this.bp = Object.assign({}, this.bpForm.value);
      if (this.checkUniqie()) {
        this.createBP();
        this.modalRef.hide();
      }
    }
  }

  checkUniqie() {
    for (let i = 0; i < this.bps.length; i++) {
      const bp1 = this.bps[i];
      if (+this.bp.code === +bp1.code) {
        this.alertify.error('Данный код уже используется для бизнес процесса (' + bp1.code + ') ' + bp1.name);
        return false;
      }
      if (bp1.children) {
        for (let ii = 0; ii < bp1.children.length; ii++) {
          const bp2 = bp1.children[ii];
          if (+this.bp.code === +bp2.code) {
            this.alertify.error('Данный код уже используется для бизнес процесса (' + bp2.code + ') ' + bp2.name);
            return false;
          }
          if (bp2.children) {
            for (let iii = 0; iii < bp2.children.length; iii++) {
              const bp3 = bp2.children[iii];
              if (+this.bp.code === +bp3.code && this.bp.id !== bp3.id) {
                this.alertify.error('Данный код уже используется для бизнес процесса (' + bp3.code + ') ' + bp3.name);
                return false;
              }
              if (this.bp.name === bp3.name && this.bp.id !== bp3.id
                && this.bp.parentId === bp3.parentId) {
                this.alertify.error('Данное наименование уже используется для ' +
                  'бизнес процесса (' + bp3.code + ') ' + bp3.name);
                return false;
              }
              if (bp3.children) {
                for (let iiii = 0; iiii < bp3.children.length; iiii++) {
                  const bp4 = bp3.children[iii];
                  if (+this.bp.code === +bp4.code && this.bp.id !== bp4.id) {
                    this.alertify.error('Данный код уже используется для бизнес процесса (' + bp4.code + ') ' + bp4.name);
                    return false;
                  }
                }
              }
            }
          }
        }
      }
    }
    return true;
  }

  createBP() {
    this.refService.createBusinessProcess(this.bp).subscribe((bp: BusinessProcess) => {
      this.alertify.success('Бизнес процесс успешно создан');
      this.reload.emit(bp);
    }, error => {
      this.alertify.error('ошибка создания бизнес процесса ' + '\n' + error);
    });
  }

  updateBP() {
    this.refService.updateBusinessProcess(this.bp).subscribe((bp: BusinessProcess) => {
      this.alertify.success('Бизнес процесс успешно обновлен');
      this.reload.emit(bp);
    }, error => {
      this.alertify.error('ошибка обновления бизнес процесса ' + '\n' + error);
    });
  }
}
