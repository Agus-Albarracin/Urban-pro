import { Role } from '../enums/role.enum'; 

export class UserQuery {
  firstName?: string;
  lastName?: string;
  username?: string;
  role?: Role;
}
