export interface User {
  id?: number;
  username: string;
  email?: string;
  is_tutor: boolean;
  is_student: boolean;
  date_joined?: string;
  password?: string;
}
