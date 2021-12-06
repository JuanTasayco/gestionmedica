import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DataService {
  public _baseUri: string;

  private headers = new HttpHeaders({ "Content-Type": "application/json" });
  private headersOctet = new HttpHeaders({ "Content-Type": "application/octet-stream" });

  constructor(private http: HttpClient) { }

  set(baseUri: string): void {
    this._baseUri = baseUri;
  }

  execPostJson(data?: any, headers: HttpHeaders = this.headers): Observable<any> {
    return this.http.post(this._baseUri, data, { headers });
  }

  execGet(data?: any): any {
    return this.http.get(this._baseUri, { params: data });
  }

  execGetJson(data?: any): any {
    return this.http.get(this._baseUri, { params: data, headers: this.headers });
  }
  execGetJsonAndStatus(data?: any): any {
    return this.http.get(this._baseUri, { params: data, headers: this.headers,  observe: 'response'});
  }
  execPostJsonAndStatus(data?: any, headers: HttpHeaders = this.headers): any {
    return this.http.post(this._baseUri, data, { headers, observe : 'response' });
  }
  execGetOctet(data?: any): any {
    return this.http.get(this._baseUri, { params: data, headers: this.headersOctet, observe: 'response', responseType: 'blob' as 'json' });
  }

  execPutJson(data?: any): any {
    return this.http.put(this._baseUri, data, { headers: this.headers });
  }

  execDeleteJson(): any {
    return this.http.delete(this._baseUri, { headers: this.headers });
  }
}
