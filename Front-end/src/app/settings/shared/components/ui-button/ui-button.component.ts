import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-ui-button',
  templateUrl: './ui-button.component.html',
  styleUrls: ['./ui-button.component.scss']
})
export class UiButtonComponent {

  @Input() pulseAnimation: boolean = false;

  @Input() disabled: boolean = false;

  @Input() typeBtn: 'vivid-sky-blue' | 'outline-primary' | 'outline-secondary' | 'solid-primary' = 'vivid-sky-blue';

  @Input() text!: string;
  @Input() routerLink!: string;
  @Input() icon!: string;
  @Output() clickEvent = new EventEmitter<void>();

  constructor() { }

  onClick() {
    if (!this.disabled) {
      this.clickEvent.emit();
    }
  }
}
