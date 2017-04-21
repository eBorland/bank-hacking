import { Component } from '@angular/core';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent {
  links: object[] = [{
    label: 'Global Position',
    path: 'home/global',
    icon: 'local_atm'
  }, {
    label: 'Wire transfer',
    path: 'home/wire',
    icon: 'send'
  }, {
    label: 'Log out',
    path: 'login',
    icon: 'power_settings_new'
  }];
  user = {
    email: 'eric.borland@soprasteria.com',
    fullName: 'Eric Borland Acosta'
  }
}
