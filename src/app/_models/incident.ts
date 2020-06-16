import {Draft} from './draft';
import {Responsible} from './responsible';
import {IncidentType} from './references/IncidentType';

export interface Incident {
  id?: number;
  dateCreate?: Date;
  incidentTypeId?: number;
  incidentType?: IncidentType;
  dateIncident: Date;
  description: string;
  status: string;
  drafts?: Draft[];
  responsibles?: Responsible[];
  collapsed?: boolean;
  comment?: string;
  authorId?: number;
}
