import {Draft} from './draft';
import {Responsible} from './responsible';

export interface Incident {
  id?: number;
  dateCreate?: Date;
  dateIncident: Date;
  description: string;
  status: string;
  drafts?: Draft[];
  responsibles?: Responsible[];
  collapsed?: boolean;
  comment?: string;
  authorId?: number;
}
