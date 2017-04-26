import { Component } from '@angular/core';
import { ApiService } from '../app.api';
import { MdSnackBar } from '@angular/material';
import { ActivatedRoute } from '@angular/router';

interface UserInfo {
  email: string;
  fullName: string;
}
@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent {
  id: string;
  links: object[];
  user: UserInfo = {
    email: 'eric.borland@soprasteria.com',
    fullName: 'Eric Borland Acosta'
  }

  constructor (
    private api: ApiService,
    public snackBar: MdSnackBar,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params['id'];
      this.links = [{
        label: 'Global Position',
        path: `home/${this.id}/global`,
        icon: 'local_atm'
      }, {
        label: 'Wire transfer',
        path: `home/${this.id}/wire`,
        icon: 'send'
      }, {
        label: 'Log out',
        path: 'login',
        icon: 'power_settings_new'
      }];

      this.api.getInfo(this.id).subscribe(
        user => this.user = user,
        error => this.snackBar.open('Your request could not be performed, please try again later!', 'Got it', { duration: 300000 }));
    });
  }
}
