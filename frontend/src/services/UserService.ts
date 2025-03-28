import CreateUserRequest from '../models/user/CreateUserRequest';
import UpdateUserRequest from '../models/user/UpdateUserRequest';
import User from '../models/user/User';
import UserQuery from '../models/user/UserQuery';
import apiService from './ApiService';

class UserService {
  async save(createUserRequest: CreateUserRequest): Promise<void> {
    console.log(createUserRequest)
    await apiService.post('/api/users', createUserRequest);
  }

  async findAll(userQuery: UserQuery): Promise<User[]> {
    return (
      await apiService.get<User[]>('/api/users', {
        params: userQuery,
      })
    ).data;
  }

  async findOne(id: string): Promise<User> {
    return (await apiService.get<User>(`/api/users/${id}`)).data;
  }

  async update(
    id: string,
    updateUserRequest: UpdateUserRequest,
  ): Promise<void> {
    const { firstName, isActive, lastName, email, password, role, username } =
      updateUserRequest;
    await apiService.put(`/api/users/${id}`, {
      firstName: firstName || undefined,
      lastName: lastName || undefined,
      email: email || undefined,
      username: username || undefined,
      role: role || undefined,
      isActive,
      password: password || undefined,
    });
  }

  async delete(id: string): Promise<void> {
    await apiService.delete(`/api/users/${id}`);
  }

  async subscribeUserToCourse(username: string, name: string): Promise<{ message: string, status: number }> {
    try {
      const response = await apiService.post('/addCourse', { username, name });
      
      return response.data;

    } catch (error) {

      console.error('Error al suscribir al usuario:', error);

      throw error; 
    }
  }
}


export default new UserService();
