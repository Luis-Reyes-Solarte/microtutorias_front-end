import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly url = `${environment.apiUrl}/users/`;

  constructor(private http: HttpClient) {}

  list() {
    return this.http.get<User[]>(this.url);
  }

  get(id: number) {
    return this.http.get<User>(`${this.url}${id}/`);
  }

  create(data: Partial<User>) {
    return this.http.post<User>(this.url, data);
  }

  update(id: number, data: Partial<User>) {
    return this.http.patch<User>(`${this.url}${id}/`, data);
  }

  delete(id: number) {
    return this.http.delete(`${this.url}${id}/`);
  }

  me() {
    return this.http.get<User>(`${this.url}me/`);
  }

  updateMe(data: Partial<User>) {
    return this.http.patch<User>(`${this.url}me/`, data);
  }

  changePassword(data: { old_password: string; new_password: string; confirm_new_password: string }) {
    return this.http.post<{ detail: string }>(`${this.url}change_password/`, data);
  }
}
