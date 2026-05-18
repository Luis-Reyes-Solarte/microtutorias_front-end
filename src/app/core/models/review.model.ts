import { TutoringAd } from './tutoring.model';
import { User } from './user.model';

export interface Review {
  id?: number;
  student: number;
  student_detail?: User;
  tutoring: number;
  booking: number;
  rating: number;
  comment: string;
  created_at: string;
}
