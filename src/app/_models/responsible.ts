import {Department} from './department';
import {Account} from './account';
import {Measure} from './measure';
import {Prop} from './prop';

export interface Responsible {
  id?: number;
  department: Department;
  result: string;
  accounts?: Account[];
  measures?: Measure[];
  props?: Prop[];
  collapsed?: boolean;
  isChanged?: boolean;
}
