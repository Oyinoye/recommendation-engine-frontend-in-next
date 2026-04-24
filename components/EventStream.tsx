'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { RealtimeEvent } from '@/lib/api';

function eventBadgeClass(type: string): string {
  switch (type) {
    case 'purchase':
      return 'bg-emerald-100 text-emerald-800';
    case 'page_view':
      return 'bg-blue-100 text-blue-800';
    case 'button_click':
      return 'bg-amber-100 text-amber-800';
    default:
      return 'bg-slate-100 text-slate-700';
  }
}

export function EventStream({ events }: { events: RealtimeEvent[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Live Event Stream</CardTitle>
        <CardDescription>Newest events appear instantly via SSE.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[520px] rounded-md border border-slate-200 p-3">
          <ul className="space-y-3" aria-live="polite" aria-label="Live events">
            {events.length === 0 ? (
              <li className="rounded-lg border border-dashed border-slate-300 p-4 text-sm text-slate-600">
                Waiting for events from backend stream...
              </li>
            ) : (
              events.map((event) => (
                <li key={event.id ?? event.event_id ?? `${event.user_id}-${event.timestamp}`} className="rounded-lg border bg-white p-3">
                  <div className="mb-2 flex items-center gap-2">
                    <Badge className={eventBadgeClass(event.event_type)}>{event.event_type}</Badge>
                    <span className="font-mono text-xs text-slate-600">{event.user_id}</span>
                    <span className="ml-auto text-xs text-slate-500">{new Date(event.timestamp).toLocaleTimeString()}</span>
                  </div>
                  {event.event_type === 'purchase' && typeof event.properties?.amount !== 'undefined' ? (
                    <p className="text-sm font-semibold text-emerald-700">Amount: ${String(event.properties.amount)}</p>
                  ) : null}
                </li>
              ))
            )}
          </ul>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
