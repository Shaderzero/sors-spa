import {Report} from './report';
import {Prop} from './prop';

export interface Measure {
  id?: number;
  responsibleId: number;
  dateCreate: Date;
  description: string;
  expectedResult: string;
  deadLine: Date;
  deadLineText: string;
  status: string;
  reports?: Report[];
  props?: Prop[];
  comment?: string;
  showReport?: boolean;
  collapsed?: boolean;
  authorId?: number;
}
