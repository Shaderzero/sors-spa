import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {BsModalRef} from 'ngx-bootstrap';
import {AlertifyService} from 'src/app/_services/alertify.service';

@Component({
  selector: 'app-code-name-modal',
  templateUrl: './code-name-modal.component.html',
  styleUrls: ['./code-name-modal.component.css']
})
export class CodeNameModalComponent implements OnInit {
  codeNameForm: FormGroup;
  title: string;
  buttonName: string;
  editMode: boolean;
  value: { id?: number; code: number, name: string };
  values: { id: number, code: number, name: string }[];
  @Output() outputValue = new EventEmitter();

  constructor(public modalRef: BsModalRef,
              private fb: FormBuilder,
              private alertify: AlertifyService) {
  }

  ngOnInit() {
    this.createCodeNameForm();
  }

  createCodeNameForm() {
    this.codeNameForm = this.fb.group({
      code: [this.value.code, [Validators.required, Validators.min(0), Validators.max(10000000)]],
      name: [this.value.name, [Validators.required, Validators.maxLength(200)]]
    });
  }

  ok() {
    if (this.editMode) {
      const id = this.value.id;
      this.value = Object.assign({}, this.codeNameForm.value);
      this.value.id = id;
      if (this.checkUniqie()) {
        this.outputValue.emit(this.value);
        this.modalRef.hide();
      }
    } else {
      this.value = Object.assign({}, this.codeNameForm.value);
      if (this.checkUniqie()) {
        this.outputValue.emit(this.value);
        this.modalRef.hide();
      }
    }
  }

  checkUniqie() {
    if (this.values === null) {
      return true;
    } else {
      for (let i = 0; i < this.values.length; i++) {
        const val = this.values[i];
        if (+this.value.code === +val.code && this.value.id !== val.id) {
          this.alertify.error('Данный код уже используется для (' + val.code + ') ' + val.name);
          return false;
        }
        if (this.value.name === val.name && this.value.id !== val.id) {
          this.alertify.error('Данное наименование уже используется для (' + val.code + ') ' + val.name);
          return false;
        }
      }
      return true;
    }
  }

}
