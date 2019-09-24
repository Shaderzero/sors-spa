import {Injectable, OnInit} from '@angular/core';
import {environment} from 'src/environments/environment';
import {AuthService} from './auth.service';
import {HttpClient} from '@angular/common/http';
import {SorsMail} from '../_models/sorsMail';
import {Draft} from '../_models/draft';
import {AlertifyService} from './alertify.service';
import {Incident} from '../_models/incident';
import {Responsible} from '../_models/responsible';
import {Account} from '../_models/account';

@Injectable({
  providedIn: 'root'
})
export class MailService {
  baseUrl = environment.apiUrl + 'mail';
  from = 'sors@gazpromexport.gazprom.ru';

  constructor(private authService: AuthService,
              private http: HttpClient,
              private alertify: AlertifyService) {
  }

  sendMail(to: string[], subject: string, text: string, link: string, comment: string) {
    const mail = new SorsMail();
    mail.from = this.from;
    mail.to = to;
    mail.subject = subject;
    mail.body = this.generateBody(text, link, comment);
    return this.http.post(this.baseUrl, mail);
  }

  getSiteUrl() {
    // let url = '';
    // if (!window.location.origin) {
    //   url = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
    // } else {
    //   url = window.location.origin;
    // }
    // url = window.location.origin;
  }

  generateBody(text: string, link: string, comment: string): string {
    const body = '<html>' +
      '<h2>Система обработки рисковых событий</h2>' +
      '<p>' + text + '</p>' +
      '<p>' + link + '</p>' +
      '<p>' + comment + '</p>' +
      '</html>';
    return body;
  }

  sendDraftCheck(draft: Draft, comment: string) {
    const subject = 'Сообщение о рисковом событие';
    const text = 'На проверку направлено сообщение о рисковом событии. Для его открытия перейдите по ссылке ниже';
    const link = window.location.origin + '/incidents/drafts/' + draft.id;
    console.log('link from method: ' + link);
    const recipients: string[] = [];
    const accounts = this.authService.getAccounts();
    for (let i = 0; i < accounts.length; i++) {
      if (+accounts[i].department.id === +draft.department.id) {
        for (let ii = 0; ii < accounts[i].accountRoles.length; ii++) {
          if (accounts[i].accountRoles[ii].name === 'riskCoordinator') {
            recipients.push(accounts[i].email);
            break;
          }
        }
      }
    }
    if (recipients.length > 0) {
      this.sendMail(recipients, subject, text, link, comment).subscribe(() => {
        this.alertify.message('Уведомление отправлено');
      }, error => {
        console.log(error);
        this.alertify.error('Ошибка отправки уведомления');
      });
    } else {
      this.alertify.error('Не найдено получателей для отправки уведомления');
    }
  }

  sendDraftSign(draft: Draft, comment: string) {
    const subject = 'Сообщение о рисковом событие';
    const text = 'На проверку направлено сообщение о рисковом событии. Для его открытия перейдите по ссылке ниже';
    const link = window.location.origin + '/incidents/drafts/' + draft.id;
    const recipients: string[] = [];
    const users = this.authService.getAccounts();
    for (let i = 0; i < users.length; i++) {
      for (let ii = 0; ii < users[i].accountRoles.length; ii++) {
        if (users[i].accountRoles[ii].name === 'riskManager') {
          recipients.push(users[i].email);
          break;
        }
      }
    }
    if (recipients.length > 0) {
      this.sendMail(recipients, subject, text, link, comment).subscribe(() => {
        this.alertify.message('Уведомление отправлено');
      }, error => {
        console.log(error);
        this.alertify.error(error);
      });
    } else {
      this.alertify.error('не найдено получателей для отправки уведомления');
    }

  }

  sendDraftRefine(draft: Draft, comment: string) {
    const subject = 'Доработка сообщения о рисковом событии';
    const text = 'На доработку направлено сообщение о рисковом событии. Для его открытия перейдите по ссылке ниже';
    const link = window.location.origin + '/incidents/drafts/' + draft.id;
    const recipients: string[] = [];
    const users = this.authService.getAccounts();
    for (let i = 0; i < users.length; i++) {
      if (+users[i].id === +draft.author.id) {
        recipients.push(users[i].email);
      } else if (+users[i].department.id === +draft.department.id) {
        for (let ii = 0; ii < users[i].accountRoles.length; ii++) {
          if (users[i].accountRoles[ii].name === 'riskCoordinator') {
            recipients.push(users[i].email);
            break;
          }
        }
      }
    }
    if (recipients.length > 0) {
      this.sendMail(recipients, subject, text, link, comment).subscribe(() => {
        this.alertify.message('Уведомление отправлено');
      }, error => {
        console.log(error);
        this.alertify.error(error);
      });
    } else {
      this.alertify.error('не найдено получателей для отправки уведомления');
    }
  }

  sendIncidentAssign(incident: Incident, comment: string) {
    const subject = 'Поступило в работу рисковое событие';
    const text = 'Вам расписано рисковое событие. ' +
      'По нему необходимо выбрать ответственных исполнителей от подразделения и/или проработать план мероприятий ' +
      'Для его открытия перейдите по ссылке ниже';
    const link = window.location.origin + '/incidents/' + incident.id;
    const recipients: string[] = [];
    const users = this.authService.getAccounts();
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      for (let ii = 0; ii < incident.responsibles.length; ii++) {
        const responsibleDep = incident.responsibles[ii].department;
        if (+user.department.id === +responsibleDep.id && this.authService.accountHasRole(user, 'riskCoordinator')) {
          recipients.push(user.email);
        }
      }
    }
    if (recipients.length > 0) {
      this.sendMail(recipients, subject, text, link, comment).subscribe(() => {
        this.alertify.message('Уведомление отправлено');
      }, error => {
        console.log(error);
        this.alertify.error(error);
      });
    } else {
      this.alertify.error('не найдено получателей для отправки уведомления');
    }
  }

  sendAccountsAssign(incident: Incident, newResponsibleAccounts: Account[], comment: string) {
    if (newResponsibleAccounts === null || newResponsibleAccounts.length === 0) {
      return;
    }
    const subject = 'Поступило в работу рисковое событие';
    const text = 'Вам расписано рисковое событие. ' +
      'По нему необходимо проработать план мероприятий. ' +
      'Для его открытия перейдите по ссылке ниже';
    const link = window.location.origin + '/incidents/' + incident.id;
    const recipients: string[] = [];
    for (let i = 0; i < newResponsibleAccounts.length; i++) {
      recipients.push(newResponsibleAccounts[i].email);
    }
    if (recipients.length > 0) {
      this.sendMail(recipients, subject, text, link, comment).subscribe(() => {
        this.alertify.message('Уведомление отправлено');
      }, error => {
        console.log(error);
        this.alertify.error(error);
      });
    } else {
      this.alertify.error('не найдено получателей для отправки уведомления');
    }
  }

  sendResponsible(incident: Incident, responsible: Responsible, comment: string) {
    const subject = 'Поступило в работу рисковое событие';
    const text = 'Вам расписано рисковое событие. ' +
      'По нему необходимо выбрать ответственных исполнителей от подразделения и/или проработать план мероприятий ' +
      'Для его открытия перейдите по ссылке ниже';
    const link = window.location.origin + '/incidents/' + incident.id;
    const recipients: string[] = [];
    const users = this.authService.getAccounts();
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      if (+user.department.id === responsible.department.id && this.authService.accountHasRole(user, 'riskCoordinator')) {
        recipients.push(user.email);
      }
    }
    if (recipients.length > 0) {
      this.sendMail(recipients, subject, text, link, comment).subscribe(() => {
        this.alertify.message('Уведомление отправлено');
      }, error => {
        console.log(error);
        this.alertify.error(error);
      });
    } else {
      this.alertify.error('не найдено получателей для отправки уведомления');
    }
  }

}
