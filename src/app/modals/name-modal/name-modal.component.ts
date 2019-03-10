import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap';
import { AlertifyService } from 'src/app/_services/alertify.service';

@Component({
  selector: 'app-name-modal',
  templateUrl: './name-modal.component.html',
  styleUrls: ['./name-modal.component.css']
})
export class NameModalComponent implements OnInit {
  nameForm: FormGroup;
  title: string;
  buttonName: string;
  editMode: boolean;
  value: {id?: number; name: string};
  values: {id: number, name: string}[];
  @Output() outputValue = new EventEmitter();

  constructor(public modalRef: BsModalRef,
              private fb: FormBuilder,
              private alertify: AlertifyService) { }

  ngOnInit() {
    this.createNameForm();
  }

  createNameForm() {
    this.nameForm = this.fb.group({
      name: [this.value.name, [Validators.required, Validators.maxLength(200)]]
    });
  }

  ok() {
    if (this.editMode) {
      const id = this.value.id;
      this.value = Object.assign({}, this.nameForm.value);
      this.value.id = id;
      if (this.checkUniqie()) {
        this.outputValue.emit(this.value);
        this.modalRef.hide();
      }
    } else {
      this.value = Object.assign({}, this.nameForm.value);
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
        if (this.value.name === val.name && this.value.id !== val.id) {
          this.alertify.error('Данное наименование уже используется');
          return false;
        }
      }
      return true;
    }
  }

}
