import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

const apiURL = 'https://localhost:4001';
const urls = {
  login: `${apiURL}/login`,
  info: `${apiURL}/info/`,
  transactions: `${apiURL}/transactions/`,
  wire: `${apiURL}/wire`,
  recover: `${apiURL}/recover/`,
  reset: `${apiURL}/reset-password`
}

const crossDomain = {
  withCredentials: true
}

@Injectable()
export class ApiService {

  constructor (
    private http: Http,
    private router: Router
  ) {}

  login(credentials): Observable<any> {
    return this.http.post(urls.login, credentials, crossDomain)
                    .map(this.parseData)
                    .catch(this.handleError);
  }


  getInfo(id): Observable<any> {
    return this.http.get(urls.info + id, crossDomain)
                    .map(this.parseData)
                    .catch(this.handleError);
  }

  getTransactions(id): Observable<any> {
    return this.http.get(urls.transactions + id, crossDomain)
                    .map(this.parseData)
                    .catch(this.handleError);
  }

  wireTransaction(transaction): Observable<any> {
    return this.http.post(urls.wire, transaction, crossDomain)
                    .catch(this.handleError);
  }

  recover(email): Observable<any> {
    return this.http.get(urls.recover + email, crossDomain)
                    .map(this.parseData)
                    .catch(this.handleError);
  }

  reset(user): Observable<any> {
    return this.http.put(urls.reset, user, crossDomain)
                    .map(this.parseData)
                    .catch(this.handleError);
  }

  private parseData(res: Response) {
    return res.json() || {};
  }

  private handleError (error: Response | any) {
    console.log('There has been an error!!', error);
    return Observable.throw(error);
  }
}
