import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BusinessProcess } from 'src/app/_models/references/businessProcess';
import { BsModalRef } from 'ngx-bootstrap';
import { AlertifyService } from 'src/app/_services/alertify.service';
import {ReferenceService} from '../../_services/reference.service';

@Component({
  selector: 'app-bp1-modal',
  templateUrl: './BP1-modal.component.html',
  styleUrls: ['./BP1-modal.component.css']
})
export class BP1ModalComponent implements OnInit {
  bpForm: FormGroup;
  title: string;
  buttonName: string;
  editMode: boolean;
  bp: BusinessProcess;
  bps: BusinessProcess[];
  @Output() reload = new EventEmitter();

  constructor(public modalRef: BsModalRef, private fb: FormBuilder,
    private refService: ReferenceService, private alertify: AlertifyService) { }

  ngOnInit() {
    this.createActivityForm();
  }

  createActivityForm() {
    this.bpForm = this.fb.group({
      code: [this.bp.code, [Validators.required, Validators.min(0), Validators.max(320600)]],
      name: [this.bp.name, [Validators.required, Validators.maxLength(200)]]});
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
    if (this.bps === null || this.bps === undefined) {
      console.log('ok');
      return true;
    } else {
      for (let i = 0; i < this.bps.length; i++) {
        const bp1 = this.bps[i];
        if (+this.bp.code === +bp1.code && this.bp.id !== bp1.id) {
          this.alertify.error('Данный код уже используется для бизнес процесса (' + bp1.code + ') ' + bp1.name);
          return false;
        }
        if (this.bp.name === bp1.name && this.bp.id !== bp1.id) {
          this.alertify.error('Данное наименование уже используется для бизнес процесса (' + bp1.code + ') ' + bp1.name);
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
                if (+this.bp.code === +bp3.code) {
                  this.alertify.error('Данный код уже используется для бизнес процесса (' + bp3.code + ') ' + bp3.name);
                  return false;
                }
                if (bp3.children) {
                  for (let iiii = 0; iiii < bp3.children.length; iiii++) {
                    const bp4 = bp3.children[iiii];
                    if (+this.bp.code === +bp4.code) {
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
  }

  createBP() {
    this.refService.createBusinessProcess(this.bp).subscribe((bp: BusinessProcess) => {
      this.reload.emit(true);
      this.alertify.success('Бизнес процесс успешно создан');
    }, error => {
      this.alertify.error('ошибка создания бизнес процесса' + '\n' + error);
    });
  }

  updateBP() {
    this.refService.updateBusinessProcess(this.bp).subscribe((bp: BusinessProcess) => {
      this.reload.emit(true);
      this.alertify.success('Бизнес процесс успешно обновлен');
    }, error => {
      this.alertify.error('ошибка обновления бизнес процесса' + '\n' + error);
    });
  }
}
