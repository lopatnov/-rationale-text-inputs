import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { RationaleInputIntDirective } from './rationale-input-int.directive/rationale-input-int.directive';
import { RationaleInputNumberDirective } from './rationale-input-number.directive/rationale-input-number.directive';

@NgModule({
  imports: [
    FormsModule,
  ],
  declarations: [RationaleInputIntDirective, RationaleInputNumberDirective],
  exports: [RationaleInputIntDirective, RationaleInputNumberDirective]
})
export class TextInputsModule { }
