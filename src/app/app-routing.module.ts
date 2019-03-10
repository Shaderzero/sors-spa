import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {AuthGuard} from './_guards/auth.guard';
import {AdminPanelComponent} from './admin/admin-panel/admin-panel.component';
import {DepartmentsComponent} from './admin/departments/departments.component';
import {DepartmentsResolver} from './_resolvers/departments.resolver';
import {DomainDepartmentsComponent} from './admin/domain-departments/domain-departments.component';
import {DomainUsersResolver} from './_resolvers/admin/domainusers.resolver';
import {DomainDepartmentsResolver} from './_resolvers/admin/domaindepartments.resolver';
import {AccountsComponent} from './admin/accounts/accounts.component';
import {AccountsResolver} from './_resolvers/admin/accounts.resolver';
import {UserDomainMergeComponent} from './admin/user-domain-merge/user-domain-merge.component';
import {ReferencesPanelComponent} from './references/references-panel/references-panel.component';
import {IncidentPanelComponent} from './incidents/incident-panel/incident-panel.component';
import {IncidentListComponent} from './incidents/incident-list/incident-list.component';
import {IncidentsResolver} from './_resolvers/incidents.resolver';
import {IncidentNewComponent} from './incidents/incident-new/incident-new.component';
import {DraftsResolver} from './_resolvers/drafts.resolver';
import {IncidentInfoComponent} from './incidents/incident-info/incident-info.component';
import {DraftListComponent} from './incidents/draft-list/draft-list.component';
import {DraftNewComponent} from './incidents/draft-new/draft-new.component';
import {DraftInfoComponent} from './incidents/draft-info/draft-info.component';
import {DraftEditComponent} from './incidents/draft-edit/draft-edit.component';
import {DraftResolver} from './_resolvers/draft.resolver';
import {IDraftsResolver} from './_resolvers/idrafts.resolver';
import {IncidentResolver} from './_resolvers/incident.resolver';
import {AccountsPageResolver} from './_resolvers/admin/accountsPage.resolver';
import {DomainDepartmentsPageResolver} from './_resolvers/admin/domaindepartmentsPage.resolver';
import {ActivityTypesResolver} from './_resolvers/references/activity-type.resolver';
import {ActivitytypeTableComponent} from './admin/activitytype-table/activitytype-table.component';
import {AreaTableComponent} from './admin/area-table/area-table.component';
import {AreasResolver} from './_resolvers/references/area.resolver';
import {BusinessTypeTableComponent} from './admin/businessType-table/businessType-table.component';
import {BusinessTypesResolver} from './_resolvers/references/business-type.resolver';
import {BpTableComponent} from './admin/bp-table/bp-table.component';
import {BusinessProcessesResolver} from './_resolvers/references/businessprocess.resolver';
import {DurationTableComponent} from './admin/duration-table/duration-table.component';
import {DurationsResolver} from './_resolvers/references/duration.resolver';
import {FactorTableComponent} from './admin/factor-table/factor-table.component';
import {FactorsResolver} from './_resolvers/references/factor.resolver';
import {ManageabilityTableComponent} from './admin/manageability-table/manageability-table.component';
import {ManageabilitiesResolver} from './_resolvers/references/manageability.resolver';
import {ReactionTableComponent} from './admin/reaction-table/reaction-table.component';
import {ReactionsResolver} from './_resolvers/references/reaction.resolver';
import {SignificanceTableComponent} from './admin/significance-table/significance-table.component';
import {SignificancesResolver} from './_resolvers/references/significance.resolver';
import {StatusTableComponent} from './admin/status-table/status-table.component';
import {RiskStatusesResolver} from './_resolvers/references/riskstatus.resolver';


const routes: Routes = [
  {path: '', component: HomeComponent},
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'admin', component: AdminPanelComponent,
        data: {roles: ['admin']},
        children: [
          {
            path: 'departments', component: DepartmentsComponent,
            resolve: {departments: DepartmentsResolver}
          },
          {
            path: 'domaindepartments', component: DomainDepartmentsComponent,
            resolve: {
              domainusers: DomainUsersResolver,
              domaindepartments: DomainDepartmentsPageResolver,
              departments: DepartmentsResolver
            }
          },
          {
            path: 'accounts', component: AccountsComponent,
            resolve: {accounts: AccountsPageResolver}
          },
          {
            path: 'domainusers', component: UserDomainMergeComponent,
            resolve: {
              accounts: AccountsResolver,
              domainusers: DomainUsersResolver,
              departments: DepartmentsResolver,
              domaindepartments: DomainDepartmentsResolver
            }
          },
          {
            path: 'activitytypes', component: ActivitytypeTableComponent,
            resolve: {activityTypes: ActivityTypesResolver}
          },
          {
            path: 'businesstypes', component: BusinessTypeTableComponent,
            resolve: {btypes: BusinessTypesResolver}
          },
          {
            path: 'businessprocesses', component: BpTableComponent,
            resolve: {bps: BusinessProcessesResolver}
          },
          {
            path: 'areas', component: AreaTableComponent,
            resolve: {areas: AreasResolver}
          },
          {
            path: 'durations', component: DurationTableComponent,
            resolve: {durations: DurationsResolver}
          },
          {
            path: 'factors', component: FactorTableComponent,
            resolve: {factors: FactorsResolver}
          },
          {
            path: 'manageabilities', component: ManageabilityTableComponent,
            resolve: {manageabilities: ManageabilitiesResolver}
          },
          {
            path: 'reactions', component: ReactionTableComponent,
            resolve: {reactions: ReactionsResolver}
          },
          {
            path: 'significances', component: SignificanceTableComponent,
            resolve: {significances: SignificancesResolver}
          },
          {
            path: 'statuses', component: StatusTableComponent,
            resolve: {statuses: RiskStatusesResolver}
          },
        ]
      },
      {
        path: 'references', component: ReferencesPanelComponent,
        data: {roles: ['admin', 'riskManager']},
        children: [
          {
            path: 'departments', component: DepartmentsComponent,
            resolve: {departments: DepartmentsResolver}
          }
        ]
      },
      {
        path: 'incidents', component: IncidentPanelComponent,
        children: [
          {
            path: 'list', component: IncidentListComponent,
            resolve: {incidents: IncidentsResolver}
          },
          {
            path: 'new', component: IncidentNewComponent,
            resolve: {
              drafts: IDraftsResolver,
              departments: DepartmentsResolver
            },
            data: {roles: ['riskManager'], status: 'sign'}
          },
          {
            path: 'wait', component: IncidentListComponent,
            resolve: {incidents: DraftsResolver}
          },
          {
            path: 'assigned', component: IncidentListComponent,
            resolve: {incidents: IncidentsResolver}
          },
          {
            path: 'inwork', component: IncidentListComponent,
            resolve: {incidents: IncidentsResolver}
          },
          {
            path: 'measurescheck', component: IncidentListComponent,
            resolve: {incidents: IncidentsResolver}
          },
          {
            path: 'reportscheck', component: IncidentListComponent,
            resolve: {incidents: IncidentsResolver}
          },
          {
            path: ':id', component: IncidentInfoComponent,
            resolve: {incident: IncidentResolver}
          },
          {
            path: 'drafts/list', component: DraftListComponent,
            resolve: {drafts: DraftsResolver},
            data: {status: 'any'}
          },
          {path: 'drafts/new', component: DraftNewComponent},
          {
            path: 'drafts/draft', component: DraftListComponent,
            resolve: {drafts: DraftsResolver},
            data: {status: 'draft'}
          },
          {
            path: 'drafts/check', component: DraftListComponent,
            resolve: {drafts: DraftsResolver},
            data: {status: 'check'}
          },
          {
            path: 'drafts/sign', component: DraftListComponent,
            resolve: {drafts: DraftsResolver},
            data: {status: 'sign'}
          },
          {
            path: 'drafts/refine', component: DraftListComponent,
            resolve: {drafts: DraftsResolver},
            data: {status: 'refine'}
          },
          {
            path: 'drafts/open', component: DraftListComponent,
            resolve: {drafts: DraftsResolver},
            data: {status: 'open'}
          },
          {
            path: 'drafts/close', component: DraftListComponent,
            resolve: {drafts: DraftsResolver},
            data: {status: 'close'}
          },
          {
            path: 'drafts/:id', component: DraftInfoComponent,
            resolve: {draft: DraftResolver}
          }, // check it
          {
            path: 'drafts/:id/edit', component: DraftEditComponent,
            resolve: {draft: DraftResolver}
          },
        ]
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
