import { TutoringAd } from './tutoring.model';
import { User } from './user.model';

export type BookingStatus = 'PENDING' | 'ACCEPTED' | 'COMPLETED' | 'CANCELLED';

export interface Booking {
  id?: number;
  student: number;
  student_detail?: User;
  tutoring: number;
  tutoring_detail?: TutoringAd;
  status: BookingStatus;
  created_at: string;
  updated_at?: string;
}
