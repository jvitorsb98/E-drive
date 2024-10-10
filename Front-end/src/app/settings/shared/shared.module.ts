import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AngularMaterialModule } from '../angular-material/angular-material.module';

// Componentes
import { UiButtonComponent } from './components/ui-button/ui-button.component';
import { LgpdModalComponent } from './components/lgpd-modal/lgpd-modal.component';

// Diretivas
import { EmailPatternValidatorDirective } from './directives/email-pattern-validator.directive';
import { DynamicMaskDirective } from './directives/dynamic-mask.directive';

// Pipes
import { PhoneMaskPipe } from './pipes/phone-mask.pipe';
import { AuthInterceptor } from '../core/security/interceptors/auth.interceptor';

@NgModule({
  declarations: [
    // Componentes
    UiButtonComponent,
    LgpdModalComponent,

    // Diretivas
    EmailPatternValidatorDirective,
    DynamicMaskDirective,

    // Pipes
    PhoneMaskPipe
  ],
  imports: [
    CommonModule,            // Fornece diretivas comuns como ngIf e ngFor
    HttpClientModule,        // Fornece o HttpClient para realizar requisições HTTP
    ReactiveFormsModule,     // Oferece suporte para formulários reativos
    FormsModule,             // Oferece suporte para formulários baseados em template
    RouterModule ,            // Fornece diretivas de roteamento como routerLink
    AngularMaterialModule // Módulo Angular Material
  ],
  exports: [
    CommonModule,            // Reexporta para uso em outros módulos
    HttpClientModule,        // Reexporta para que o HttpClient esteja disponível em outros módulos
    ReactiveFormsModule,     // Reexporta para usar formulários reativos em outros módulos
    FormsModule,             // Reexporta para usar formulários baseados em template em outros módulos
    UiButtonComponent, 
    LgpdModalComponent,      // Reexporta para usar este componente em outros módulos
    EmailPatternValidatorDirective, // Reexporta para usar esta diretiva em outros módulos
    DynamicMaskDirective,    // Reexporta para usar esta diretiva em outros módulos
    PhoneMaskPipe            // Reexporta para usar este pipe em outros módulos
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }],
})
export class SharedModule { }

