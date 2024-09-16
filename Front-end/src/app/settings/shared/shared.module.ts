import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UiButtonComponent } from './components/ui-button/ui-button.component';
import { EmailPatternValidatorDirective } from './directives/email-pattern-validator.directive';
import { DynamicMaskDirective } from './directives/dynamic-mask.directive';
import { PhoneMaskPipe } from './pipes/phone-mask.pipe';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    UiButtonComponent,
    EmailPatternValidatorDirective,
    DynamicMaskDirective,
    PhoneMaskPipe,
  ],
  imports: [
    CommonModule,
    RouterModule,
  ],
  exports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    UiButtonComponent,
    EmailPatternValidatorDirective,
    DynamicMaskDirective,
    PhoneMaskPipe,
  ]
})
export class SharedModule { }
