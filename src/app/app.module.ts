import 'hammerjs';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';

import { FlexLayoutModule } from "@angular/flex-layout";
import { MaterialModule } from './app.material';

import { AppComponent } from './app.component';
import { ApiService } from './app.api';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { GlobalComponent } from './home/global/global.component';
import { WireComponent } from './home/wire/wire.component';

const appRoutes: Routes = [
  { path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  { path: 'login', component: LoginComponent },
  {
    path: 'home/:id',
    component: HomeComponent,
    children: [
      {
        path: '',
        redirectTo: 'global',
        pathMatch: 'full'
      },
      { path: 'global', component: GlobalComponent },
      { path: 'wire', component: WireComponent }
    ]
  }
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    GlobalComponent,
    WireComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    JsonpModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(appRoutes),
    FlexLayoutModule,
    MaterialModule
  ],
  providers: [ApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
