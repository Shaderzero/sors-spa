import {Account} from './account';
import {DomainDepartment} from './domainDepartment';

export interface Department {
  id?: number;
  code: string;
  shortName: string;
  name: string;
  domainDepartments: DomainDepartment[];
  accounts?: Account[];
  checked?: boolean;
}
