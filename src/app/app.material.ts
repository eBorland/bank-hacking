import { NgModule } from '@angular/core';
import {MdButtonModule, MdCheckboxModule} from '@angular/material';

@NgModule({
  imports: [MdButtonModule, MdCheckboxModule],
  exports: [MdButtonModule, MdCheckboxModule],
})
export class MaterialModule { }