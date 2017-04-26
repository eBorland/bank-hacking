import { NgModule } from '@angular/core';
import {
  MdButtonModule,
  MdCheckboxModule,
  MdCardModule,
  MdInputModule,
  MdToolbarModule,
  MdSidenavModule,
  MdListModule,
  MdSnackBarModule
} from '@angular/material';

const MaterialImports = [
  MdButtonModule,
  MdCheckboxModule,
  MdCardModule,
  MdInputModule,
  MdToolbarModule,
  MdSidenavModule,
  MdListModule,
  MdSnackBarModule
];

@NgModule({
  imports: MaterialImports,
  exports: MaterialImports,
})
export class MaterialModule { }