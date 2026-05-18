import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Review } from '../models/review.model';

@Injectable({ providedIn: 'root' })
export class ReviewService {
  private readonly url = `${environment.apiUrl}/reviews/`;

  constructor(private http: HttpClient) {}

  list() {
    return this.http.get<Review[]>(this.url);
  }

  create(data: Partial<Review>) {
    return this.http.post<Review>(this.url, data);
  }
}
