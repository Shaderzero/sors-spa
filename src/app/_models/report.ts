import {Prop} from './prop';

export interface Report {
  id?: number;
  measureId: number;
  description: string;
  dateCreate: Date;
  status: string;
  props?: Prop[];
  authorId?: number;
}
