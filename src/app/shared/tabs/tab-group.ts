import { Component } from '@angular/core';
import { TabState } from './tab-state';

@Component({
  selector: 'app-tab-group',
  providers: [TabState],
  template: `
    <div class="border-b border-gray-200 flex gap-4">
      <!-- Render the buttons -->
      @for (tab of tabs(); track tab.label()) {
        <button
          (click)="activate(tab.label())"
          class="px-4 py-2 border-b-2 transition-colors font-medium"
          [class.border-blue-600]="state.activeTab() === tab.label()"
          [class.text-blue-600]="state.activeTab() === tab.label()"
          [class.border-transparent]="state.activeTab() !== tab.label()"
        >
          {{ tab.label() }}
        </button>
      }
    </div>

    <!-- Render the active tab content -->
    <ng-content />
  `,
})
export class TabComponent {
  label!: string;
}
