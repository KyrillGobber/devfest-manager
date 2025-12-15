import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable, Signal } from '@angular/core';
import { DevFestEvent } from '../models/event.model';
import { Observable } from 'rxjs';
import { API_URL } from './tokens';

@Injectable({
  providedIn: 'root',
})
export class EventsService {
  private readonly apiUrl = `${inject(API_URL)}/events`;
  private readonly http = inject(HttpClient);

  getEventsResource(query: Signal<string>) {
    return httpResource<DevFestEvent[]>(() => {
      const q = query();
      return q ? `${this.apiUrl}?q=${q}` : this.apiUrl;
    });
  }

  getEventResource(id: Signal<string>) {
    return httpResource<DevFestEvent>(() => {
      const eventId = id();

      if (!eventId) return undefined;
      return `${this.apiUrl}/${eventId}`;
    });
  }

  deleteEvent(eventId: string) {
    return this.http.delete<void>(`${this.apiUrl}/${eventId}`);
  }

  createEvent(event: Omit<DevFestEvent, 'id'>): Observable<DevFestEvent> {
    return this.http.post<DevFestEvent>(this.apiUrl, event);
  }
}
