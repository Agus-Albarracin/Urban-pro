export default interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
  password?: string;
  role?: string;
  isActive?: boolean;
}
