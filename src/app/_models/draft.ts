import {Account} from './account';
import {Department} from './department';

export interface Draft {
  id?: number;
  dateCreate?: Date;
  description1: string;
  description2: string;
  description3: string;
  description4: string;
  description5: string;
  status: string;
  author?: Account;
  department?: Department;
  collapsed?: boolean;
  authorId?: number;
  departmentId?: number;
  checked?: boolean;
}
