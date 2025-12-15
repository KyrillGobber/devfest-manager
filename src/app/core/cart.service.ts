import { HttpClient } from "@angular/common/http";
import { computed, inject, Injectable, signal } from "@angular/core";
import { TICKETS_URL } from "./tokens";

interface TicketEntry {
  id: string;
  eventId: string;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly http = inject(HttpClient);
  private readonly ticketsUrl = inject(TICKETS_URL)

  private readonly ticketIds = signal<string[]>([]);

  readonly count = computed(() => this.ticketIds().length);

  constructor() {
    this.loadTickets();
  }

  private loadTickets(): void {
    this.http.get<TicketEntry[]>(this.ticketsUrl).subscribe({
      next: data => {
        this.ticketIds.set(data.map(ticket => ticket.id));
      }
    });
  }

  addTicket(eventId: string): void {
    const prevTicketIds = this.ticketIds();

    this.ticketIds.update(ids => [...ids, eventId]);

    this.http.post<TicketEntry>(this.ticketsUrl, { eventId }).subscribe({
      next: data => {
        console.log('Ticket added:', data);
      },
      error: () => {
        this.ticketIds.set(prevTicketIds);
      }
    });
  }
}
