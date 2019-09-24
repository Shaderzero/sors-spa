import {Account} from './account';

export interface Log {
  id: number;
  account: Account;
  info: string;
  action: string;
  timestamp: Date;
}
