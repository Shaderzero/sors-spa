import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AutosizeModule} from 'ngx-autosize';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {
  AccordionModule,
  BsDatepickerModule,
  BsDropdownModule,
  ButtonsModule,
  CollapseModule,
  defineLocale,
  ModalModule,
  PaginationModule,
  ruLocale,
  TooltipModule,
  TypeaheadModule
} from 'ngx-bootstrap';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {ValuesComponent} from './values/values.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';

import {AuthService} from './_services/auth.service';
import {DepartmentsComponent} from './admin/departments/departments.component';
import {UserService} from './_services/user.service';
import {DepartmentsResolver} from './_resolvers/departments.resolver';
import {HomeComponent} from './home/home.component';
import {NavComponent} from './nav/nav.component';
import {AlertifyService} from './_services/alertify.service';
import {ReferencesPanelComponent} from './references/references-panel/references-panel.component';
import {AuthGuard} from './_guards/auth.guard';
import {AdminService} from './_services/admin.service';
import {DepartmentModalComponent} from './modals/department-modal/department-modal.component';
import {WinAuthInterceptor} from './_services/WinAuthInterceptor.service';
import {DraftsResolver} from './_resolvers/drafts.resolver';
import {DraftNewComponent} from './incidents/draft-new/draft-new.component';
import {DraftListComponent} from './incidents/draft-list/draft-list.component';
import {IncidentPanelComponent} from './incidents/incident-panel/incident-panel.component';
import {ConfirmModalComponent} from './references/confirm-modal/confirm-modal.component';
import {DraftInfoComponent} from './incidents/draft-info/draft-info.component';
import {HasRoleDirective} from './_directives/HasRole.directive';
import {DraftEditComponent} from './incidents/draft-edit/draft-edit.component';
import {IncidentNewComponent} from './incidents/incident-new/incident-new.component';
import {IncidentListComponent} from './incidents/incident-list/incident-list.component';
import {IncidentInfoComponent} from './incidents/incident-info/incident-info.component';
import {SelectuserModalComponent} from './incidents/selectuser-modal/selectuser-modal.component';
import {MeasureInfoComponent} from './incidents/measure-info/measure-info.component';
import {MeasureNewModalComponent} from './incidents/measure-new-modal/measure-new-modal.component';
import {MeasureService} from './_services/measure.service';
import {ReportInfoComponent} from './incidents/report-info/report-info.component';
import {ReportService} from './_services/report.service';
import {ReportNewModalComponent} from './incidents/report-new-modal/report-new-modal.component';
import {AdminPanelComponent} from './admin/admin-panel/admin-panel.component';
import {AccountsComponent} from './admin/accounts/accounts.component';
import {AccountModalComponent} from './modals/account-modal/account-modal.component';
import {AccountsResolver} from './_resolvers/admin/accounts.resolver';
import {UserDomainMergeComponent} from './admin/user-domain-merge/user-domain-merge.component';
import {DomainUsersResolver} from './_resolvers/admin/domainusers.resolver';
import {DomainDepartmentsResolver} from './_resolvers/admin/domaindepartments.resolver';
import {DomainDepartmentsComponent} from './admin/domain-departments/domain-departments.component';
import {DomainDepartmentModalComponent} from './modals/domain-department-modal/domain-department-modal.component';
import {MailService} from './_services/mail.service';
import {ConfirmCommentModalComponent} from './references/confirm-comment-modal/confirm-comment-modal.component';
import {DraftResolver} from './_resolvers/draft.resolver';
import {IDraftsResolver} from './_resolvers/idrafts.resolver';
import {DraftService} from './_services/draft.service';
import {IncidentService} from './_services/incident.service';
import {IncidentsResolver} from './_resolvers/incidents.resolver';
import {IncidentResolver} from './_resolvers/incident.resolver';
import {IncidentDraftModalComponent} from './incidents/incident-draft-modal/incident-draft-modal.component';
import {IncidentResponsibleModalComponent} from './incidents/incident-responsible-modal/incident-responsible-modal.component';
import {TextEditModalComponent} from './modals/text-edit-modal/text-edit-modal.component';
import {DateEditModalComponent} from './modals/date-edit-modal/date-edit-modal.component';
import {LoaderService} from './_helpers/loader/loader.service';
import {AccountsPageResolver} from './_resolvers/admin/accountsPage.resolver';
import {DomainDepartmentsPageResolver} from './_resolvers/admin/domaindepartmentsPage.resolver';
import {ActivityTypesResolver} from './_resolvers/references/activity-type.resolver';
import {ActivitytypeTableComponent} from './admin/activitytype-table/activitytype-table.component';
import {Activity1ModalComponent} from './modals/activity1-modal/activity1-modal.component';
import {Activity2ModalComponent} from './modals/activity2-modal/activity2-modal.component';
import {Activity3ModalComponent} from './modals/activity3-modal/activity3-modal.component';
import {CodeNameModalComponent} from './modals/code-name-modal/code-name-modal.component';
import {NameModalComponent} from './modals/name-modal/name-modal.component';
import {AreaTableComponent} from './admin/area-table/area-table.component';
import {AreasResolver} from './_resolvers/references/area.resolver';
import {ReferenceService} from './_services/reference.service';
import {BusinessTypeTableComponent} from './admin/businessType-table/businessType-table.component';
import {BusinessTypesResolver} from './_resolvers/references/business-type.resolver';
import {BpTableComponent} from './admin/bp-table/bp-table.component';
import {BP1ModalComponent} from './modals/bp1-modal/BP1-modal.component';
import {BP2ModalComponent} from './modals/bp2-modal/BP2-modal.component';
import {BP3ModalComponent} from './modals/bp3-modal/BP3-modal.component';
import {BP4ModalComponent} from './modals/bp4-modal/BP4-modal.component';
import {BusinessProcessesResolver} from './_resolvers/references/businessprocess.resolver';
import {DurationsResolver} from './_resolvers/references/duration.resolver';
import {FactorsResolver} from './_resolvers/references/factor.resolver';
import {ManageabilitiesResolver} from './_resolvers/references/manageability.resolver';
import {ReactionsResolver} from './_resolvers/references/reaction.resolver';
import {RiskStatusesResolver} from './_resolvers/references/riskstatus.resolver';
import {SignificancesResolver} from './_resolvers/references/significance.resolver';
import {DurationTableComponent} from './admin/duration-table/duration-table.component';
import {FactorTableComponent} from './admin/factor-table/factor-table.component';
import {FactorCategoryModalComponent} from './modals/factor-category-modal/factor-category-modal.component';
import {FactorClassModalComponent} from './modals/factor-class-modal/factor-class-modal.component';
import {FactorTypeModalComponent} from './modals/factor-type-modal/factor-type-modal.component';
import {ManageabilityTableComponent} from './admin/manageability-table/manageability-table.component';
import {ReactionTableComponent} from './admin/reaction-table/reaction-table.component';
import {SignificanceTableComponent} from './admin/significance-table/significance-table.component';
import {StatusTableComponent} from './admin/status-table/status-table.component';

defineLocale('ru', ruLocale);

@NgModule({
  declarations: [
    AppComponent,
    HasRoleDirective,
    ValuesComponent,
    DepartmentsComponent,
    DomainDepartmentsComponent,
    HomeComponent,
    NavComponent,
    ReferencesPanelComponent,
    DepartmentModalComponent,
    DraftNewComponent,
    DraftListComponent,
    DraftInfoComponent,
    DraftEditComponent,
    IncidentNewComponent,
    IncidentListComponent,
    IncidentInfoComponent,
    IncidentPanelComponent,
    ConfirmModalComponent,
    ConfirmCommentModalComponent,
    SelectuserModalComponent,
    MeasureInfoComponent,
    MeasureNewModalComponent,
    ReportInfoComponent,
    ReportNewModalComponent,
    AdminPanelComponent,
    AccountsComponent,
    UserDomainMergeComponent,
    AccountModalComponent,
    DomainDepartmentModalComponent,
    IncidentDraftModalComponent,
    IncidentResponsibleModalComponent,
    TextEditModalComponent,
    DateEditModalComponent,
    ActivitytypeTableComponent,
    Activity1ModalComponent,
    Activity2ModalComponent,
    Activity3ModalComponent,
    CodeNameModalComponent,
    NameModalComponent,
    AreaTableComponent,
    BusinessTypeTableComponent,
    BpTableComponent,
    BP1ModalComponent,
    BP2ModalComponent,
    BP3ModalComponent,
    BP4ModalComponent,
    DurationTableComponent,
    FactorTableComponent,
    FactorCategoryModalComponent,
    FactorClassModalComponent,
    FactorTypeModalComponent,
    ManageabilityTableComponent,
    ReactionTableComponent,
    SignificanceTableComponent,
    StatusTableComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AutosizeModule,
    BsDropdownModule.forRoot(),
    BsDatepickerModule.forRoot(),
    ModalModule.forRoot(),
    ButtonsModule.forRoot(),
    PaginationModule.forRoot(),
    CollapseModule.forRoot(),
    AccordionModule.forRoot(),
    TooltipModule.forRoot(),
    TypeaheadModule.forRoot()
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: WinAuthInterceptor,
      multi: true
    },
    AuthService,
    UserService,
    AdminService,
    DraftService,
    IncidentService,
    MeasureService,
    ReportService,
    MailService,
    ReferenceService,
    DepartmentsResolver,
    DomainDepartmentsResolver,
    DomainDepartmentsPageResolver,
    DraftsResolver,
    IDraftsResolver,
    DraftResolver,
    IncidentsResolver,
    IncidentResolver,
    AccountsResolver,
    AccountsPageResolver,
    DomainUsersResolver,
    AlertifyService,
    AuthGuard,
    LoaderService,
    ActivityTypesResolver,
    AreasResolver,
    BusinessTypesResolver,
    BusinessProcessesResolver,
    DurationsResolver,
    FactorsResolver,
    ManageabilitiesResolver,
    ReactionsResolver,
    RiskStatusesResolver,
    SignificancesResolver
  ],
  entryComponents: [
    DepartmentModalComponent,
    ConfirmModalComponent,
    ConfirmCommentModalComponent,
    SelectuserModalComponent,
    MeasureNewModalComponent,
    ReportNewModalComponent,
    AccountModalComponent,
    DomainDepartmentModalComponent,
    IncidentDraftModalComponent,
    IncidentResponsibleModalComponent,
    TextEditModalComponent,
    DateEditModalComponent,
    Activity1ModalComponent,
    Activity2ModalComponent,
    Activity3ModalComponent,
    CodeNameModalComponent,
    NameModalComponent,
    BP1ModalComponent,
    BP2ModalComponent,
    BP3ModalComponent,
    BP4ModalComponent,
    FactorCategoryModalComponent,
    FactorClassModalComponent,
    FactorTypeModalComponent
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {
}
