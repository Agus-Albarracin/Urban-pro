import Course from '../models/course/Course';
import CourseQuery from '../models/course/CourseQuery';
import apiService from './ApiService';

class UserService {
  async save(formData: FormData): Promise<void> {
    try {
      await apiService.post('/api/courses', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } catch (error) {
      console.log(error);
    }
  }
  

  async findAll(courseQuery: CourseQuery): Promise<Course[]> {
    return (
      await apiService.get<Course[]>('/api/courses', { params: courseQuery })
    ).data;
  }

  async findOne(id: string): Promise<Course> {
    return (await apiService.get<Course>(`/api/courses/${id}`)).data;
  }

  async update(id: string, formData: FormData): Promise<void> {
  try{
    await apiService.put(`/api/courses/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }catch(error){ console.log("Error in update", error) }       
  }

  async delete(id: string): Promise<void> {
    await apiService.delete(`/api/courses/${id}`);
  }
}

export default new UserService();
