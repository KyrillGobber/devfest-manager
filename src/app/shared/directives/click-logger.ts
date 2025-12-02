import { Directive, input } from '@angular/core';

@Directive({
  selector: '[appClickLogger]',
  host: {
    '(click)': 'onClick()',
  },
})
export class ClickLogger {
  // The directive expects an input named 'eventName'
  eventName = input<string>('unknown_event');

  onClick() {
    console.log(`[Analytics] Card Clicked: ${this.eventName()}`);
  }
}
