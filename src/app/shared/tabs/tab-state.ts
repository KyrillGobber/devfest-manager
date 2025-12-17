import { Injectable, signal } from '@angular/core';

@Injectable()
export class TabState {
  private activeTab = signal<string>('');

  active(label: string) {
    this.activeTab.set(label);
  }
}
