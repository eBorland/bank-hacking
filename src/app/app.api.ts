import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

interface User {
  email: string;
  fullName: string;
}

@Injectable()
export class ApiService {
  constructor (private http: Http) {}

  login(credentials): Observable<User> {
    return this.http.post('api/login', credentials)
                    .map(this.parseData)
                    .catch(this.handleError);
  }

  private parseData(res: Response) {
    let body = res.json();
    return body.data || {};
  }

  private handleError (error: Response | any) {
    console.log('There has been an error!!', error);
    return Observable.throw(error);
  }
}
