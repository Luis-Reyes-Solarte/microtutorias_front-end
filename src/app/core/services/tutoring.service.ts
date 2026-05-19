import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { TutoringAd } from '../models/tutoring.model';

@Injectable({ providedIn: 'root' })
export class TutoringService {
  private readonly url = `${environment.apiUrl}/tutorias/`;

  constructor(private http: HttpClient) {}

  list() {
    return this.http.get<TutoringAd[]>(this.url);
  }

  listMine() {
    return this.http.get<TutoringAd[]>(`${this.url}?mine=1`);
  }

  get(id: number) {
    return this.http.get<TutoringAd>(`${this.url}${id}/`);
  }

  create(data: Partial<TutoringAd>) {
    return this.http.post<TutoringAd>(this.url, data);
  }

  update(id: number, data: Partial<TutoringAd>) {
    return this.http.patch<TutoringAd>(`${this.url}${id}/`, data);
  }

  delete(id: number) {
    return this.http.delete(`${this.url}${id}/`);
  }
}
