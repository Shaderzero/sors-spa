import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Account} from 'src/app/_models/account';
import {UserService} from 'src/app/_services/user.service';
import {BsModalRef, TypeaheadMatch} from 'ngx-bootstrap';

@Component({
  selector: 'app-selectuser-modal',
  templateUrl: './selectuser-modal.component.html',
  styleUrls: ['./selectuser-modal.component.css']
})
export class SelectuserModalComponent implements OnInit {
  @Output() updateSelectedUsers = new EventEmitter();
  title: string;
  selectedUsers: Account[];
  selectedValue: string;
  currentUser: Account;
  departmentUsers: Account[] = [];

  constructor(private userService: UserService,
              public modalRef: BsModalRef) {
  }

  ngOnInit() {
    this.getDepartmentUsers();
  }

  updateUsers() {
    this.updateSelectedUsers.emit(this.selectedUsers);
    this.modalRef.hide();
  }

  getDepartmentUsers() {
    this.userService.getDepartmentAccounts(this.currentUser.department.id).subscribe((res: Account[]) => {
      this.departmentUsers = res;
    });
  }

  onSelect(event: TypeaheadMatch): void {
    this.selectedUsers.push(event.item);
    this.selectedValue = '';
  }

  removeUser(user: Account) {
    for (let i = 0; i < this.selectedUsers.length; i++) {
      if (+this.selectedUsers[i].id === +user.id) {
        this.selectedUsers.splice(i, 1);
        break;
      }
    }
  }

}
