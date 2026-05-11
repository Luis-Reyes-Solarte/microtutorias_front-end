import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Subject } from '../models/subject.model';

@Injectable({ providedIn: 'root' })
export class SubjectService {
  private readonly url = `${environment.apiUrl}/subjects/`;

  constructor(private http: HttpClient) {}

  list() {
    return this.http.get<Subject[]>(this.url);
  }

  get(id: number) {
    return this.http.get<Subject>(`${this.url}${id}/`);
  }

  create(data: Partial<Subject>) {
    return this.http.post<Subject>(this.url, data);
  }

  update(id: number, data: Partial<Subject>) {
    return this.http.patch<Subject>(`${this.url}${id}/`, data);
  }

  delete(id: number) {
    return this.http.delete(`${this.url}${id}/`);
  }
}
