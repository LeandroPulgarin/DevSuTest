import {
  HttpClient,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';

type HttpServiceOptions = { headers: HttpHeaders; params: HttpParams };
@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  private createOptions(
    headers?: HttpHeaders,
    params?: HttpParams
  ): HttpServiceOptions {
    const options: HttpServiceOptions = {} as HttpServiceOptions;
    if (headers) {
      options.headers = headers;
    }
    if (params) {
      options.params = params;
    }
    return options;
  }

  doGet<T>(
    endpoint: string,
    params?: HttpParams,
    headers?: HttpHeaders
  ): Observable<T> {
    const url = `${this.baseUrl}/${endpoint}`;
    const options = this.createOptions(headers, params);
    return this.http.get<T>(url, options);
  }

  doPost<T>(
    endpoint: string,
    body: unknown,
    params?: HttpParams,
    headers?: HttpHeaders
  ): Observable<T> {
    const url = `${this.baseUrl}/${endpoint}`;
    const options = this.createOptions(headers, params);
    return this.http.post<T>(url, body, options);
  }

  doPut<T>(
    endpoint: string,
    body: unknown,
    params?: HttpParams,
    headers?: HttpHeaders
  ): Observable<T> {
    const url = `${this.baseUrl}/${endpoint}`;
    const options = this.createOptions(headers, params);
    return this.http.put<T>(url, body, options);
  }

  doDelete<T>(
    endpoint: string,
    params?: HttpParams,
    headers?: HttpHeaders
  ): Observable<T> {
    const url = `${this.baseUrl}/${endpoint}`;
    const options = this.createOptions(headers, params);
    return this.http.delete<T>(url, options);
  }

  doPatch<T>(
    endpoint: string,
    body: unknown,
    params?: HttpParams,
    headers?: HttpHeaders
  ): Observable<T> {
    const url = `${this.baseUrl}/${endpoint}`;
    const options = this.createOptions(headers, params);
    return this.http.patch<T>(url, body, options);
  }
}
