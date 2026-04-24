const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, '') ?? 'http://localhost:3000';
const TENANT_ID = process.env.NEXT_PUBLIC_TENANT_ID ?? 'dev-tenant';

function buildApiUrl(path: string): string {
  return `${API_BASE_URL}${path}`;
}

export interface RealtimeEvent {
  id?: string;
  event_id?: string;
  event_type: string;
  user_id: string;
  timestamp: string;
  properties?: Record<string, unknown>;
}

export interface UserContext {
  persona?: string;
  segment?: string;
  confidence_score?: number;
  top_interests?: string[];
  engagement_score?: number;
  churn_risk?: string;
  recommendations?: string[];
  [key: string]: unknown;
}

export function createEventStream(onMessage: (event: RealtimeEvent) => void): EventSource {
  const streamUrl = buildApiUrl(`/api/v1/events/stream?tenant_id=${encodeURIComponent(TENANT_ID)}`);

  const eventSource = new EventSource(streamUrl);

  eventSource.onmessage = (message) => {
    try {
      const parsed = JSON.parse(message.data) as RealtimeEvent;
      onMessage(parsed);
    } catch {
      // Ignore malformed stream messages
    }
  };

  return eventSource;
}


export async function fetchUserContext(userId: string, signal?: AbortSignal): Promise<UserContext> {
  const response = await fetch(
    buildApiUrl(`/api/users/${encodeURIComponent(userId)}/context?tenant_id=${encodeURIComponent(TENANT_ID)}`),
    {
      method: 'GET',
      signal,
      headers: {
        'Content-Type': 'application/json',
        'x-tenant-id': TENANT_ID,
      },
      cache: 'no-store',
    },
  );

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('No persona/context found for this user yet.');
    }
    throw new Error(`Request failed (${response.status}).`);
  }

  return (await response.json()) as UserContext;
}
