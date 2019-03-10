import {Component, OnInit} from '@angular/core';
import {Reaction} from 'src/app/_models/references/reaction';
import {ActivatedRoute} from '@angular/router';
import {AlertifyService} from 'src/app/_services/alertify.service';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {ReferenceService} from '../../_services/reference.service';
import {NameModalComponent} from '../../modals/name-modal/name-modal.component';
import {ConfirmModalComponent} from '../../references/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-reaction-table',
  templateUrl: './reaction-table.component.html',
  styleUrls: ['./reaction-table.component.css']
})
export class ReactionTableComponent implements OnInit {
  modalRef: BsModalRef;
  reactions: Reaction[];

  constructor(private route: ActivatedRoute,
              private refService: ReferenceService,
              private modalService: BsModalService,
              private alertify: AlertifyService) {
  }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.reactions = data['reactions'];
    });
  }

  createReaction() {
    const initialState = {
      title: 'Создание способа реагирования на риск',
      buttonName: 'Создать',
      values: this.reactions,
      value: {id: null, code: 0, name: ''},
      editMode: false
    };
    this.modalRef = this.modalService.show(NameModalComponent, {initialState});
    this.modalRef.content.outputValue.subscribe((result: Reaction) => {
      if (result) {
        this.create(result);
      }
    });
  }

  editReaction(reaction: Reaction) {
    const initialState = {
      title: 'Редактирование способа реагирования на риск',
      buttonName: 'Изменить',
      values: this.reactions,
      value: reaction,
      editMode: true
    };
    this.modalRef = this.modalService.show(NameModalComponent, {initialState});
    this.modalRef.content.outputValue.subscribe((result: Reaction) => {
      if (result) {
        this.edit(result);
      }
    });
  }

  edit(reaction: Reaction) {
    this.refService.updateReaction(reaction).subscribe((res: Reaction) => {
      this.alertify.success('Способ реагирования на риск успешно обновлен');
      for (let i = 0; i < this.reactions.length; i++) {
        if (+this.reactions[i].id === +res.id) {
          this.reactions[i] = res;
        }
      }
    }, error => {
      this.alertify.error('Ошибка обновления способа реагирования на риск, ' + error);
    });
  }

  create(reaction: Reaction) {
    this.refService.createReaction(reaction).subscribe((res: Reaction) => {
      this.alertify.success('Новый способ реагирования на риск успешно создан');
      this.reactions.push(res);
    }, error => {
      this.alertify.error('Ошибка создания нового способа реагирования на риск, ' + error);
    });
  }

  deleteReaction(reaction: Reaction) {
    const initialState = {
      title: 'Удаление способа реагирования на риск',
      text: 'Удалить способ реагирования на риск '
        + reaction.name + '?'
    };
    this.modalRef = this.modalService.show(ConfirmModalComponent, {ignoreBackdropClick: true, initialState});
    this.modalRef.content.result.subscribe((res: boolean) => {
      if (res) {
        this.refService.deleteReaction(reaction).subscribe(() => {
          this.alertify.success('Способ реагирования на риск удалён');
        }, error => {
          console.log(error);
          this.alertify.error('Ошибка удаления способа реагирования на риск');
        });
      } else {
        this.alertify.message('Отмена');
      }
    });
  }
}

