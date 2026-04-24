'use client';

import { useState } from 'react';
import { Loader2, RefreshCw } from 'lucide-react';
import { fetchUserContext, UserContext } from '@/lib/api';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

function churnRiskClass(churnRisk?: string): string {
  if (churnRisk === 'High') return 'text-red-600';
  if (churnRisk === 'Medium') return 'text-amber-600';
  return 'text-emerald-600';
}

export function UserSearch() {
  const [userId, setUserId] = useState('');
  const [context, setContext] = useState<UserContext | null>(null);
  const [pendingContext, setPendingContext] = useState<UserContext | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchUser = async () => {
    if (!userId.trim()) {
      setError('Please enter a user ID.');
      return;
    }

    setLoading(true);
    setError(null);
    setPendingContext(context);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);

    try {
      const data = await fetchUserContext(userId.trim(), controller.signal);
      setContext(data);
      setPendingContext(null);
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        setError('The request timed out. The LLM may still be processing. Please retry.');
      } else {
        setError(err instanceof Error ? err.message : 'Unexpected error occurred.');
      }
    } finally {
      clearTimeout(timeout);
      setLoading(false);
    }
  };

  const shownContext = context ?? pendingContext;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Persona Viewer</CardTitle>
        <CardDescription>Search by user_id to inspect generated context and recommendations.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input
            aria-label="User ID"
            placeholder="e.g. user_123"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                void searchUser();
              }
            }}
          />
          <Button onClick={() => void searchUser()} disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" /> : <RefreshCw className="mr-2 h-4 w-4" aria-hidden="true" />}
            Lookup
          </Button>
        </div>

        {error ? (
          <Alert>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}

        {shownContext ? (
          <section className="space-y-4 rounded-lg border border-slate-200 bg-slate-50 p-4" aria-live="polite">
            <div>
              <h3 className="text-lg font-semibold">{String(shownContext.persona ?? 'Unknown Persona')}</h3>
              <p className="text-sm text-slate-600">Segment: {String(shownContext.segment ?? 'N/A')}</p>
              <p className="text-sm text-slate-600">
                Confidence: {typeof shownContext.confidence_score === 'number' ? `${(shownContext.confidence_score * 100).toFixed(1)}%` : 'N/A'}
              </p>
            </div>

            <div>
              <h4 className="mb-2 text-sm font-semibold">Top Interests</h4>
              <div className="flex flex-wrap gap-2">
                {(shownContext.top_interests ?? []).map((interest) => (
                  <Badge key={interest} className="bg-white text-slate-700 border border-slate-200">
                    {interest}
                  </Badge>
                ))}
                {(shownContext.top_interests ?? []).length === 0 ? <span className="text-sm text-slate-600">No interests available.</span> : null}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <h4 className="text-sm font-semibold">Engagement Score</h4>
                <p className="text-2xl font-bold">{typeof shownContext.engagement_score === 'number' ? `${shownContext.engagement_score}/10` : 'N/A'}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold">Churn Risk</h4>
                <p className={`text-2xl font-bold ${churnRiskClass(shownContext.churn_risk)}`}>{String(shownContext.churn_risk ?? 'Unknown')}</p>
              </div>
            </div>

            <div>
              <h4 className="mb-2 text-sm font-semibold">Recommendations</h4>
              <ul className="list-disc space-y-1 pl-5 text-sm text-slate-800">
                {(shownContext.recommendations ?? []).map((rec, idx) => (
                  <li key={`${rec}-${idx}`}>{rec}</li>
                ))}
                {(shownContext.recommendations ?? []).length === 0 ? <li>No recommendations available.</li> : null}
              </ul>
            </div>
          </section>
        ) : null}
      </CardContent>
    </Card>
  );
}
