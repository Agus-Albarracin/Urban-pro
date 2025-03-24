export default interface UpdateCourseRequest {
  name?: string;
  description?: string;
  type?: string;
  file?: string | null;
}
