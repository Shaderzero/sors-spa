import {Department} from './department';
import {Role} from './role';

export interface Account {
  id?: number;
  name: string;
  fullname: string;
  email: string;
  department?: Department;
  accountRoles?: Role[];
}
