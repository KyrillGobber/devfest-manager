import { Component, inject, signal } from '@angular/core';
import { DevFestEvent } from '../../models/event.model';
import { form, Field, required, minLength, disabled, debounce } from '@angular/forms/signals';
import { EventsService } from '../../core/events.service';
import { Router } from '@angular/router';

interface CreateEventForm extends Omit<DevFestEvent, 'id'> {}

@Component({
  selector: 'app-create-event',
  template: `
    <div class="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow">
      <h2 class="text-2xl font-bold mb-6 text-gray-800">Create New Event</h2>

      <!-- TODO Mod 4: Bind [group] -->
      <form (submit)="onSubmit($event)" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
          <input
            [field]="form.title"
            type="text"
            class="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="e.g. Angular Workshop"
          />
          @if (form.title().touched() && form.title().invalid()) {
            <p class="text-red-500 text-sm mt-1">{{ form.title().errors()[0].message }}</p>
          }
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            [field]="form.description"
            rows="3"
            class="w-full px-4 py-2 border rounded-md outline-none"
          ></textarea>

          @if (form.description().touched() && form.description().invalid()) {
            <p class="text-red-500 text-sm mt-1">{{ form.description().errors()[0].message }}</p>
          }
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label>Date</label>
            <input
              [field]="form.date"
              type="datetime-local"
              class="w-full px-4 py-2 border rounded-md"
            />
          </div>
          <div>
            <label>Location</label>
            <input [field]="form.location" type="text" class="w-full px-4 py-2 border rounded-md" />
          </div>
        </div>

        <div class="flex justify-between items-center mb-2">
          <label class="block text-sm font-medium text-gray-700">Speakers</label>
          <button
            type="button"
            (click)="addSpeaker()"
            class="text-sm text-blue-600 hover:underline"
          >
            + Add Speaker
          </button>
        </div>

        @for (speaker of eventData().speakers; track $index) {
          <div class="flex gap-2">
            <input
              [field]="form.speakers[$index]"
              type="text"
              placeholder="Speaker Name"
              class="flex-1 px-4 py-2 border rounded-md"
            />

            <button type="button" (click)="removeSpeaker($index)" class="text-red-500 px-2">
              ✕
            </button>
          </div>
        } @empty {
          <p class="text-gray-500 text-sm">No speakers added yet.</p>
        }

        <div class="flex justify-end gap-4 pt-4">
          <button type="button" class="px-4 py-2 text-gray-600 hover:text-gray-800">Cancel</button>
          <button
            type="submit"
            class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Create Event
          </button>
        </div>
      </form>
    </div>
  `,
  imports: [Field],
})
export class CreateEvent {
  readonly eventService = inject(EventsService);
  readonly router = inject(Router);
  readonly eventData = signal<CreateEventForm>({
    title: '',
    description: '',
    date: new Date().toISOString().slice(0, 16),
    location: '',
    speakers: [],
    image: '/images/event4.png',
  });

  readonly form = form(this.eventData, (root) => {
    required(root.title, { message: 'Title is required' });

    // Rules for Desc
    // A. Debounce: Wait 1000ms after typing stops before updating the model
    // B. Conditional Disable: Disable description if Title is empty
    // valueOf() lets us look up the current value of other fields
    // C. Validation
    debounce(root.description, 1000);
    disabled(root.description, ({ valueOf }) => !valueOf(root.title));
    required(root.description, { message: 'Description is required' });
    minLength(root.description, 10, { message: 'Description must be at least 10 chars' });

    required(root.date, { message: 'Date is required' });

    required(root.location, { message: 'Location is required' });
  });

  addSpeaker() {
    this.eventData.update((current) => ({
      ...current,
      speakers: [...current.speakers, ''],
    }));
  }

  removeSpeaker(index: number) {
    this.eventData.update((current) => ({
      ...current,
      speakers: current.speakers.filter((_, i) => i !== index),
    }));
  }

  onSubmit(event: SubmitEvent) {
    event.preventDefault();
    if (this.form().invalid()) return;

    const payload = this.eventData();

    this.eventService.createEvent(payload).subscribe({
      next: () => {
        alert('Event created successfully!');
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Error creating event:', err);
        alert('Failed to create event. Please try again.');
      }
    });
  }
}
