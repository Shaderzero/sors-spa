import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ActivityType} from '../_models/references/activity-type';
import {Area} from '../_models/references/area';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {BusinessType} from '../_models/references/businessType';
import {BusinessProcess} from '../_models/references/businessProcess';
import {Significance} from '../_models/references/significance';
import {Duration} from '../_models/references/duration';
import {Manageability} from '../_models/references/manageability';
import {Reaction} from '../_models/references/reaction';
import {RiskStatus} from '../_models/references/riskStatus';
import {Factor} from '../_models/references/factor';
import {IncidentType} from '../_models/references/IncidentType';

@Injectable({
  providedIn: 'root'
})
export class ReferenceService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {
  }

  getIncidentTypes(): Observable<IncidentType[]> {
    return this.http.get<IncidentType[]>(this.baseUrl + 'references/incidenttypes');
  }

  getIncidentType(id: number): Observable<IncidentType> {
    return this.http.get<IncidentType>(this.baseUrl + 'references/incidenttypes/' + id);
  }

  deleteIncidentType(id: number) {
    return this.http.delete(this.baseUrl + 'references/incidenttypes/' + id);
  }

  createIncidentType(entity: IncidentType) {
    return this.http.post<IncidentType>(this.baseUrl + 'references/incidenttypes', entity);
  }

  updateIncidentType(entity: IncidentType) {
    return this.http.put<IncidentType>(this.baseUrl + 'references/incidenttypes/' + entity.id, entity);
  }

  getActivityTypes(): Observable<ActivityType[]> {
    return this.http.get<ActivityType[]>(this.baseUrl + 'references/activitytypes');
  }

  getActivityType(id: number): Observable<ActivityType> {
    return this.http.get<ActivityType>(this.baseUrl + 'references/activitytypes/' + id);
  }

  deleteActivityType(id: number) {
    return this.http.delete(this.baseUrl + 'references/activitytypes/' + id);
  }

  createActivityType(activityType: ActivityType) {
    return this.http.post<ActivityType>(this.baseUrl + 'references/activitytypes', activityType);
  }

  updateActivityType(activityType: ActivityType) {
    return this.http.put<ActivityType>(this.baseUrl + 'references/activitytypes/' + activityType.id, activityType);
  }

  getAreas(): Observable<Area[]> {
    return this.http.get<Area[]>(this.baseUrl + 'references/areas');
  }

  updateArea(area: Area) {
    return this.http.put<Area>(this.baseUrl + 'references/areas/' + area.id, area);
  }

  createArea(area: Area) {
    return this.http.post<Area>(this.baseUrl + 'references/areas', area);
  }

  deleteArea(area: Area) {
    return this.http.delete<Area>(this.baseUrl + 'references/areas/' + area.id, {});
  }

  getBusinessTypes(): Observable<BusinessType[]> {
    return this.http.get<BusinessType[]>(this.baseUrl + 'references/businesstypes');
  }

  updateBusinessType(btype: BusinessType) {
    return this.http.put<BusinessType>(this.baseUrl + 'references/businesstypes/' + btype.id, btype);
  }

  createBusinessType(btype: BusinessType) {
    return this.http.post<BusinessType>(this.baseUrl + 'references/businesstypes', btype);
  }

  deleteBusinessType(btype: BusinessType) {
    return this.http.delete<BusinessType>(this.baseUrl + 'references/businesstypes/' + btype.id, {});
  }

  getBusinessProcesses(): Observable<BusinessProcess[]> {
    return this.http.get<BusinessProcess[]>(this.baseUrl + 'references/businessprocesses');
  }

  getBusinessProcess(bpId: number): Observable<BusinessProcess> {
    return this.http.get<BusinessProcess>(this.baseUrl + 'references/businessprocesses/' + bpId);
  }

  createBusinessProcess(bp: BusinessProcess) {
    return this.http.post<BusinessProcess>(this.baseUrl + 'references/businessprocesses', bp);
  }

  updateBusinessProcess(bp: BusinessProcess) {
    return this.http.put<BusinessProcess>(this.baseUrl + 'references/businessprocesses/' + bp.id, bp);
  }

  deleteBusinessProcess(bpId: number) {
    return this.http.delete<BusinessProcess>(this.baseUrl + 'references/businessprocesses/' + bpId, {});
  }

  getSignificances(): Observable<Significance[]> {
    return this.http.get<Significance[]>(this.baseUrl + 'references/significances');
  }

  updateSignificance(significance: Significance) {
    return this.http.put<Significance>(this.baseUrl + 'references/significances/' + significance.id, significance);
  }

  createSignificance(significance: Significance) {
    return this.http.post<Significance>(this.baseUrl + 'references/significances', significance);
  }

  deleteSignificance(significance: Significance) {
    return this.http.delete<Significance>(this.baseUrl + 'references/significances/' + significance.id, {});
  }

  getDurations(): Observable<Duration[]> {
    return this.http.get<Duration[]>(this.baseUrl + 'references/durations');
  }

  updateDuration(duration: Duration) {
    return this.http.put<Duration>(this.baseUrl + 'references/durations/' + duration.id, duration);
  }

  createDuration(duration: Duration) {
    return this.http.post<Duration>(this.baseUrl + 'references/durations', duration);
  }

  deleteDuration(duration: Duration) {
    return this.http.delete<Duration>(this.baseUrl + 'references/durations/' + duration.id, {});
  }

  getManageabilities(): Observable<Manageability[]> {
    return this.http.get<Manageability[]>(this.baseUrl + 'references/manageabilities');
  }

  updateManageability(manageability: Manageability) {
    return this.http.put<Manageability>(this.baseUrl + 'references/manageabilities/' + manageability.id, manageability);
  }

  createManageability(manageability: Manageability) {
    return this.http.post<Manageability>(this.baseUrl + 'references/manageabilities', manageability);
  }

  deleteManageability(manageability: Manageability) {
    return this.http.delete<Manageability>(this.baseUrl + 'references/manageabilities/' + manageability.id, {});
  }

  getReactions(): Observable<Reaction[]> {
    return this.http.get<Reaction[]>(this.baseUrl + 'references/reactions');
  }

  updateReaction(reaction: Reaction) {
    return this.http.put<Reaction>(this.baseUrl + 'references/reactions/' + reaction.id, reaction);
  }

  createReaction(reaction: Reaction) {
    return this.http.post<Reaction>(this.baseUrl + 'references/reactions', reaction);
  }

  deleteReaction(reaction: Reaction) {
    return this.http.delete<Reaction>(this.baseUrl + 'references/reactions/' + reaction.id, {});
  }

  getRiskStatuses(): Observable<RiskStatus[]> {
    return this.http.get<Reaction[]>(this.baseUrl + 'references/riskstatuses');
  }

  updateRiskStatus(riskStatus: RiskStatus) {
    return this.http.put<RiskStatus>(this.baseUrl + 'references/riskstatuses/' + riskStatus.id, riskStatus);
  }

  createRiskStatus(riskStatus: RiskStatus) {
    return this.http.post<RiskStatus>(this.baseUrl + 'references/riskstatuses', riskStatus);
  }

  deleteRiskStatus(riskStatus: RiskStatus) {
    return this.http.delete<RiskStatus>(this.baseUrl + 'references/riskstatuses/' + riskStatus.id, {});
  }

  getFactors(): Observable<Factor[]> {
    return this.http.get<Factor[]>(this.baseUrl + 'references/factors');
  }

  getFactor(factorId: number): Observable<Factor> {
    return this.http.get<Factor>(this.baseUrl + 'references/factors/' + factorId);
  }

  createFactor(factor: Factor) {
    return this.http.post<Factor>(this.baseUrl + 'references/factors', factor);
  }

  updateFactor(factor: Factor) {
    return this.http.put<Factor>(this.baseUrl + 'references/factors/' + factor.id, factor);
  }

  deleteFactor(factorId: number) {
    return this.http.delete<Factor>(this.baseUrl + 'references/factors/' + factorId, {});
  }
}
