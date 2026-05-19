import { Subject } from './subject.model';
import { User } from './user.model';

export interface TutoringAd {
  id?: number;
  tutor: number;
  tutor_detail?: User;
  subject: number;
  subject_name?: string;
  description: string;
  price_per_hour: number | string;
  available_date: string;
}
