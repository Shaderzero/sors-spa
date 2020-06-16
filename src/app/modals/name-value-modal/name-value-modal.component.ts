import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {BsModalRef} from 'ngx-bootstrap';
import {AlertifyService} from 'src/app/_services/alertify.service';

@Component({
  selector: 'app-name-value-modal',
  templateUrl: './name-value-modal.component.html',
  styleUrls: ['./name-value-modal.component.css']
})
export class NameValueModalComponent implements OnInit {
  nameValueForm: FormGroup;
  title: string;
  buttonName: string;
  editMode: boolean;
  value: { id?: number; name: string, value: string, param: string };
  values: { id: number, name: string, value: string, param: string }[];
  @Output() outputValue = new EventEmitter();

  constructor(public modalRef: BsModalRef,
              private fb: FormBuilder,
              private alertify: AlertifyService) {
  }

  ngOnInit() {
    console.log(this.value);
    this.createNameValueForm();
  }

  createNameValueForm() {
    this.nameValueForm = this.fb.group({
      name: [this.value.name, [Validators.required]],
      value: [this.value.value, [Validators.required]],
      param: [this.value.param]
    });
  }

  ok() {
    if (this.editMode) {
      const id = this.value.id;
      this.value = Object.assign({}, this.nameValueForm.value);
      console.log(this.value);
      this.value.id = id;
      this.outputValue.emit(this.value);
      this.modalRef.hide();
    } else {
      this.value = Object.assign({}, this.nameValueForm.value);
      console.log(this.value);
      this.outputValue.emit(this.value);
      this.modalRef.hide();
    }
  }

  checkUnique() {
    if (this.values === null) {
      return true;
    } else {
      for (let i = 0; i < this.values.length; i++) {
        const val = this.values[i];
        if (this.value.name === val.name && this.value.param === val.param && this.value.id !== val.id) {
          this.alertify.error('Данный код уже используется для (' + val.param + ') ' + val.name);
          return false;
        }
      }
      return true;
    }
  }

}
