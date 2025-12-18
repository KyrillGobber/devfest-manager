import { Directive, input } from '@angular/core';

@Directive({
  selector: '[appClickLogger]',
  host: {
    '(click)': 'onClick()',
  },
})
export class ClickLogger {
  eventName = input<string>('none');

  onClick() {
    console.log('Got clicked:', this.eventName());
  }
}
