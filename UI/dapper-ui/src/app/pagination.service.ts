import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PaginatedResult } from './interfaces/PaginatedResult';

@Injectable({
  providedIn: 'root',
})
export class PaginationService {
  headers = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private http: HttpClient) {}

  retrivePaginatedData<T>(url: string): Observable<PaginatedResult<T>> {
    return this.http.get<PaginatedResult<T>>(url, this.headers);
  }
}
