export interface User {
  id?: number;
  username: string;
  email?: string;
  is_tutor: boolean;
  is_student: boolean;
  is_staff?: boolean;
  date_joined?: string;
  password?: string;
}
