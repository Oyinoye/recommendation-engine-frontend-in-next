'use client';

import { useEffect, useMemo, useState } from 'react';
import { EventStream } from '@/components/EventStream';
import { Metrics } from '@/components/Metrics';
import { UserSearch } from '@/components/UserSearch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { createEventStream, RealtimeEvent } from '@/lib/api';

const MAX_EVENTS = 100;

export default function DashboardPage() {
  const [realtimeEvents, setRealtimeEvents] = useState<RealtimeEvent[]>([]);
  const [streamError, setStreamError] = useState<string | null>(null);
  const [streamConnected, setStreamConnected] = useState(false);

  useEffect(() => {
    const source = createEventStream((event) => {
      setStreamConnected(true);
      setStreamError(null);
      setRealtimeEvents((prev) => [event, ...prev].slice(0, MAX_EVENTS));
    });

    source.onerror = () => {
      setStreamConnected(false);
      setStreamError('Realtime connection dropped. Retrying automatically...');
    };

    source.onopen = () => {
      setStreamConnected(true);
      setStreamError(null);
    };

    return () => {
      source.close();
      setStreamConnected(false);
    };
  }, []);

  const subtitle = useMemo(
    () => 'Monitor ingested events in real time and inspect AI-generated user personas.',
    [],
  );

  return (
    <main className="mx-auto min-h-screen max-w-6xl space-y-6 p-4 sm:p-6">
      <section className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Segment-to-Context Dashboard</h1>
        <p className="text-slate-600">{subtitle}</p>
      </section>

      {streamError ? (
        <Alert>
          <AlertDescription>{streamError}</AlertDescription>
        </Alert>
      ) : null}

      <Metrics events={realtimeEvents} streamConnected={streamConnected} />

      <Tabs defaultValue="realtime" className="space-y-4">
        <TabsList>
          <TabsTrigger value="realtime">Real-time Dashboard</TabsTrigger>
          <TabsTrigger value="search">Persona Viewer</TabsTrigger>
        </TabsList>

        <TabsContent value="realtime">
          <EventStream events={realtimeEvents} />
        </TabsContent>

        <TabsContent value="search">
          <UserSearch />
        </TabsContent>
      </Tabs>
    </main>
  );
}
