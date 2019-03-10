import {Account} from './account';

export interface Prop {
  id?: number;
  dateCreate: Date;
  author: Account;
  action: string;
  comment: string;
}
