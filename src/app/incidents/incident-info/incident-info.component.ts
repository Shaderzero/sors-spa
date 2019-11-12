import {Component, OnInit} from '@angular/core';
import {Incident} from 'src/app/_models/incident';
import {AuthService} from 'src/app/_services/auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Account} from 'src/app/_models/account';
import {UserService} from 'src/app/_services/user.service';
import {Responsible} from 'src/app/_models/responsible';
import {BsModalRef, BsModalService, TypeaheadMatch} from 'ngx-bootstrap';
import {AlertifyService} from 'src/app/_services/alertify.service';
import {ConfirmModalComponent} from 'src/app/references/confirm-modal/confirm-modal.component';
import {IncidentService} from 'src/app/_services/incident.service';
import {DraftService} from 'src/app/_services/draft.service';
import {IncidentDraftModalComponent} from '../incident-draft-modal/incident-draft-modal.component';
import {Draft} from '../../_models/draft';
import {IncidentResponsibleModalComponent} from '../incident-responsible-modal/incident-responsible-modal.component';
import {Department} from '../../_models/department';
import {MailService} from '../../_services/mail.service';
import {TextEditModalComponent} from '../../modals/text-edit-modal/text-edit-modal.component';
import {Patcher} from '../../_models/patch';
import {DateEditModalComponent} from '../../modals/date-edit-modal/date-edit-modal.component';
import {PatcherDate} from '../../_models/patchDate';
import {CountsService} from '../../_services/counts.service';

@Component({
  selector: 'app-incident-info',
  templateUrl: './incident-info.component.html',
  styleUrls: ['./incident-info.component.css']
})
export class IncidentInfoComponent implements OnInit {
  modalRef: BsModalRef;
  incident: Incident;
  tmp: Account[] = [];
  newResponsibleAccounts: Account[] = []; // необходимо для рассылки писем...
  currentUser: Account;
  selectedValue: string;
  departmentAccounts: Account[];
  draftOpen = false;
  responsibleOpen = false;
  measureOpen = false;

  constructor(private authService: AuthService,
              private modalService: BsModalService,
              private route: ActivatedRoute,
              private incidentService: IncidentService,
              private draftService: DraftService,
              private userService: UserService,
              private alertify: AlertifyService,
              private mailService: MailService,
              private router: Router,
              private countsService: CountsService) {
  }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.incident = data['incident'];
    });
    this.currentUser = this.authService.currentUser;
    this.getDepartmentAccounts();
  }

  // fillDraftsAuthorNames() {
  //   for (let i = 0; i < this.incident.drafts. length; i++) {
  //     this.incident.drafts[i].author.fullname = this.authService.getFioByLogin(this.incident.drafts[i].author.name);
  //   }
  // }

  isAdmin() {
    return this.authService.isAdmin();
  }

  isRiskManager() {
    return this.authService.isRiskManager();
  }

  isRiskCoordinator(responsible: Responsible) {
    return this.authService.isRiskCoordinator(responsible.department);
  }

  getDepartmentAccounts() {
    this.userService.getDepartmentAccounts(this.currentUser.department.id).subscribe((res: Account[]) => {
      this.departmentAccounts = res;
      // console.log(this.departmentAccounts);
      // for (let i = 0; i < this.departmentAccounts.length; i++) {
      //   this.departmentAccounts[i].fullname = this.authService.getFioByLogin(this.departmentAccounts[i].name);
      // }
    });
  }

  onSelect(event: TypeaheadMatch, responsible: Responsible): void {
    if (this.tmp.length === 0) {
      this.tmp = [...responsible.accounts];
    }
    let include = true;
    for (let i = 0; i < responsible.accounts.length; i++) {
      if (+responsible.accounts[i].id === +event.item.id) {
        include = false;
        break;
      }
    }
    if (include) {
      this.newResponsibleAccounts.push(event.item);
      responsible.accounts.push(event.item);
    } else {
      this.alertify.error('Работник уже включён в список ответственных');
    }
    responsible.isChanged = true;
    responsible.collapsed = false;
    this.selectedValue = '';
  }

  editDescription() {
    const initialState = {
      title: 'Редактирование описания',
      inputText: this.incident.description
    };
    this.modalRef = this.modalService.show(TextEditModalComponent, {ignoreBackdropClick: true, initialState});
    this.modalRef.content.outputText.subscribe((res: string) => {
      const patch: Patcher = {
        propertyName: 'Description',
        propertyValue: res
      };
      this.incidentService.patchIncident(this.incident, [patch]).subscribe(() => {
        this.incident.description = res;
        this.alertify.success('Описание успешно обновлено');
      }, error => {
        console.log(error);
        this.alertify.error('ошибка обновления описания');
      });
    });
  }

  editDate() {
    const initialState = {
      title: 'Редактирование даты',
      inputDate: this.incident.dateIncident
    };
    this.modalRef = this.modalService.show(DateEditModalComponent, {ignoreBackdropClick: true, initialState});
    this.modalRef.content.outputDate.subscribe((res: Date) => {
      res = new Date(res.setHours(res.getHours() + 12));
      const patch: PatcherDate = {
        propertyName: 'DateIncident',
        propertyValue: res
      };
      this.incidentService.patchDateIncident(this.incident, [patch]).subscribe(() => {
        this.incident.dateIncident = res;
        this.alertify.success('Дата успешно обновлена');
      }, error => {
        console.log(error);
        this.alertify.error('ошибка обновления даты');
      });
    });
  }

  removeAccount(user: Account, responsible: Responsible) {
    if (this.tmp.length === 0) {
      this.tmp = [...responsible.accounts];
    }
    for (let i = 0; i < responsible.accounts.length; i++) {
      if (+responsible.accounts[i].id === +user.id) {
        responsible.accounts.splice(i, 1);
        responsible.isChanged = true;
        break;
      }
    }
    if (this.newResponsibleAccounts.length > 0) {
      for (let i = 0; i < this.newResponsibleAccounts.length; i++) {
        if (+this.newResponsibleAccounts[i].id === +user.id) {
          this.newResponsibleAccounts.splice(i, 1);
          break;
        }
      }
    }
  }

  saveResponsibleAccounts(responsible: Responsible) {
    this.incidentService.updateResponsibleAccounts(responsible).subscribe(() => {
      this.alertify.success('список ответственных работников обновлён');
      // надо подумать, что с этим делать
      // const responsibleForMail: Responsible = {
      //   id: responsible.id,
      //   department: responsible.department,
      //   result: responsible.result,
      //   accounts: this.newResponsibleAccounts
      // };
      if (this.newResponsibleAccounts.length > 0) {
        this.mailService.sendAccountsAssign(this.incident, this.newResponsibleAccounts, '');
        this.newResponsibleAccounts = [];
      }
      responsible.collapsed = false;
      responsible.isChanged = false;
      this.tmp = [];
    }, error => {
      console.log(error);
      this.alertify.error('ошибка обновления списка ответственных работников');
    });
  }

  cancelResponsibleAccounts(responsible: Responsible) {
    responsible.accounts = [...this.tmp];
    responsible.isChanged = false;
    this.tmp = [];
  }

  addResponsibles() {
    const initialState = {
      selectedResponsibles: this.incident.responsibles
    };
    this.modalRef = this.modalService.show(IncidentResponsibleModalComponent, {ignoreBackdropClick: true, initialState});
    // this.modalRef.setClass('modal-lg');
    this.modalRef.content.outputDepartments.subscribe((departments: Department[]) => {
      if (departments.length > 0) {
        for (let i = 0; i < departments.length; i++) {
          this.incidentService.addResponsible(this.incident, departments[i]).subscribe((responsible: Responsible) => {
            this.incident.responsibles.push(responsible);
            this.alertify.success('ответственное подразделение добавлено');
            this.mailService.sendResponsible(this.incident, responsible, '');
          }, error => {
            console.log(error);
            this.alertify.error('ошибка добавления ответстенного подразделения');
          });
        }
      } else {
        this.alertify.message('подразделений не выбрано');
      }
    });
  }

  removeResponsible(responsible: Responsible) {
    const initialState = {
      title: 'Исключение ответственного подразделения',
      text: 'Исключить подразделение из списка ответственных?'
    };
    this.modalRef = this.modalService.show(ConfirmModalComponent, {ignoreBackdropClick: true, initialState});
    this.modalRef.content.result.subscribe((res: boolean) => {
      if (res) {
        this.incidentService.removeResponsible(this.incident, responsible).subscribe(() => {
          for (let i = 0; i < this.incident.responsibles.length; i++) {
            if (+this.incident.responsibles[i].id === +responsible.id) {
              this.incident.responsibles.splice(i, 1);
              break;
            }
          }
          this.alertify.success('Подразделение исключено');
        }, error => {
          console.log(error);
          this.alertify.error('Ошибка исключения подразделения');
        });
      } else {
        this.alertify.message('Отмена');
      }
    });
  }

  addDrafts() {
    this.modalRef = this.modalService.show(IncidentDraftModalComponent, {ignoreBackdropClick: true});
    this.modalRef.setClass('modal-lg');
    this.modalRef.content.selectedDrafts.subscribe((drafts: Draft[]) => {
      if (drafts.length > 0) {
        for (let i = 0; i < drafts.length; i++) {
          this.incidentService.addDraft(this.incident, drafts[i]).subscribe(() => {
            this.incident.drafts.push(drafts[i]);
            this.alertify.success('сообщение добавлено');
            this.setDraftStatus(drafts[i], 'open');
          }, error => {
            console.log(error);
            this.alertify.error('ошибка добавления сообщения');
          });
        }
      } else {
        this.alertify.message('сообщений не выбрано');
      }
    });
  }

  removeDraft(draft: Draft) {
    const initialState = {
      title: 'Исключение сообщения из рискового события',
      text: 'Исключить из списка включённых в рисковое событие сообщений? Сообщению будет присвоен статус рассмотрения риск менеджером.'
    };
    this.modalRef = this.modalService.show(ConfirmModalComponent, {ignoreBackdropClick: true, initialState});
    this.modalRef.content.result.subscribe((res: boolean) => {
      if (res) {
        this.incidentService.removeDraft(this.incident, draft).subscribe(() => {
          for (let i = 0; i < this.incident.drafts.length; i++) {
            if (+this.incident.drafts[i].id === +draft.id) {
              this.incident.drafts.splice(i, 1);
              break;
            }
          }
          this.alertify.success('Сообщение исключено');
          this.setDraftStatus(draft, 'sign');
        }, error => {
          console.log(error);
          this.alertify.error('Ошибка исключения сообщения');
        });
      } else {
        this.alertify.message('Отмена');
      }
    });
  }

  setDraftStatus(draft: Draft, status: string) {
    const model: any = {};
    model.id = draft.id;
    model.status = status;
    model.authorId = this.authService.currentUser.id;
    model.departmentId = this.authService.currentUser.department.id;
    this.draftService.setStatus(model).subscribe(() => {
      this.alertify.message('статус сообщения обновлён');
      this.countsService.loadAll();
    }, error => {
      console.log(error);
      this.alertify.error('ошибка обновления статуса сообщения');
    });
  }

  close() {
    const initialState = {
      title: 'Закрытие рискового события',
      text: 'Вы уверены что хотите закрыть рисковое событие? ' +
        'В результате закрытия связанные сообщения и мероприятия будут закрыты и переведены в архив.'
    };
    this.modalRef = this.modalService.show(ConfirmModalComponent, {initialState});
    this.modalRef.content.result.subscribe((res: boolean) => {
      if (res) {
        this.incidentService.closeIncident(this.incident).subscribe(() => {
          this.alertify.message('Рисковое событие закрыто');
          this.router.navigate(['/incidents/list']);
        }, error => {
          console.log(error);
          this.alertify.error('ошибка закрытия рискового события');
        });
      }
    });
  }

  delete() {
    const initialState = {
      title: 'Удаление рискового события',
      text: 'Вы уверены что хотите удалить рисковое событие? ' +
        'В результате удаления будет удалена информация об ответственных подразделениях и мероприятиях. ' +
        'Включенные сообщения о рисковых событиях удалены не будут - ' +
        'по ним изменится статус на ожидание рассмотрения риск менеджером'
    };
    this.modalRef = this.modalService.show(ConfirmModalComponent, {initialState});
    this.modalRef.content.result.subscribe((res) => {
      if (res) {
        this.incidentService.deleteIncident(this.incident).subscribe(() => {
          this.modalRef.hide();
          this.alertify.message('Рисковое событие удалено');
          this.router.navigate(['/incidents/list']);
          if (this.incident.drafts) {
            for (let i = 0; i < this.incident.drafts.length; i++) {
              const draft = this.incident.drafts[i];
              const status = {
                id: draft.id,
                status: 'sign',
                authorId: this.authService.currentUser.id,
                departmentId: this.authService.currentUser.department.id
              };
              this.draftService.setStatus(status).subscribe(() => {
                this.alertify.message('статус сообщения обновлён');
              }, error => {
                console.log(error);
                this.alertify.error('ошибка обновления статуса сообщения');
              });
            }
          }
        }, error => {
          this.modalRef.hide();
          console.log(error);
          this.alertify.error('ошибка удаления рискового события');
        });
      } else {
        this.modalRef.hide();
        this.alertify.message('отмена');
      }
    });
  }

  getExcel() {
    this.incidentService.getExcel(this.incident.id);
  }

}
