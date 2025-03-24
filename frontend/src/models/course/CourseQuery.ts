export default interface CourseQuery {
  name?: string;
  description?: string;
  type?: string;
  sort?: string;
  order?: 'asc' | 'desc';
  limit?: number,
}
