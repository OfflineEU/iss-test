import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})


export class IssInfo {
  constructor(private http: HttpClient) {

  }

  getLocationData(): Observable<any> {
    return this.http.get<any>('http://api.open-notify.org/iss-now.json');
  }

  getAstronauts():Observable<any> {
    return this.http.get('http://api.open-notify.org/astros.json');
  }
}
