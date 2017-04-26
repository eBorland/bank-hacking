import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

const apiURL = 'http://localhost:4000';
const urls = {
  login: `${apiURL}/login`,
  info: `${apiURL}/info/`,
  transactions: `${apiURL}/transactions/`,
  wire: `${apiURL}/wire`
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

  private parseData(res: Response) {
    return res.json() || {};
  }

  private handleError (error: Response | any) {
    console.log('There has been an error!!', error);
    if (error.status === 401) {
      console.log('nagivating to login')
      //this.router.navigateByUrl('/login');
    }
    return Observable.throw(error);
  }
}
