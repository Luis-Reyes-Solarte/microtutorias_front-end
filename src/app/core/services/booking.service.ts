import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Booking } from '../models/booking.model';

@Injectable({ providedIn: 'root' })
export class BookingService {
  private readonly url = `${environment.apiUrl}/bookings/`;

  constructor(private http: HttpClient) {}

  list() {
    return this.http.get<Booking[]>(this.url);
  }

  listMine() {
    return this.http.get<Booking[]>(`${this.url}?as=student`);
  }

  listRequests() {
    return this.http.get<Booking[]>(`${this.url}?as=tutor`);
  }

  get(id: number) {
    return this.http.get<Booking>(`${this.url}${id}/`);
  }

  create(data: Partial<Booking>) {
    return this.http.post<Booking>(this.url, data);
  }

  accept(id: number) {
    return this.http.patch<Booking>(`${this.url}${id}/accept/`, {});
  }

  reject(id: number) {
    return this.http.patch<Booking>(`${this.url}${id}/reject/`, {});
  }

  complete(id: number) {
    return this.http.patch<Booking>(`${this.url}${id}/complete/`, {});
  }
}
