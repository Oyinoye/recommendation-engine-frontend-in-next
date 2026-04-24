'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RealtimeEvent } from '@/lib/api';

function uniqueUserCount(events: RealtimeEvent[]): number {
  const ids = new Set(events.map((event) => event.user_id));
  return ids.size;
}

export function Metrics({ events, streamConnected }: { events: RealtimeEvent[]; streamConnected: boolean }) {
  const purchaseEvents = events.filter((event) => event.event_type === 'purchase').length;
  const activeUsers = uniqueUserCount(events);

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm text-slate-600">Stream Status</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold" aria-live="polite">
            {streamConnected ? 'Connected' : 'Disconnected'}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm text-slate-600">Events in Memory</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{events.length}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm text-slate-600">Active Users / Purchases</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{activeUsers} / {purchaseEvents}</p>
        </CardContent>
      </Card>
    </div>
  );
}
