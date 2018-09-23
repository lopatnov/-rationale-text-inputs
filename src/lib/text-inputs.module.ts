import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { RationaleInputIntDirective } from './rationale-input-int.directive/rationale-input-int.directive';

@NgModule({
  imports: [
    FormsModule,
  ],
  declarations: [RationaleInputIntDirective],
  exports: [RationaleInputIntDirective]
})
export class TextInputsModule { }
