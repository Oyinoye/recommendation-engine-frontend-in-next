# Segment-to-Context Frontend

This frontend is a Next.js dashboard for the Segment-to-Context project. It connects to the backend API to:

- show a live stream of ingested events over SSE
- display high-level realtime metrics
- look up AI-generated user persona/context data

## Tech stack

- Next.js App Router
- React
- Tailwind CSS

## Local startup

From the `frontend/` directory:

```bash
npm install
npm run dev
```

The app starts on:

```text
http://localhost:3001
```

## Backend dependency

The frontend expects the backend API to be running separately. By default it connects to:

```text
http://localhost:3000
```

Make sure the backend is running before testing:

- the live event stream
- persona/context lookups
- dashboard metrics based on incoming events

## Environment variables

You can override the defaults with:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
NEXT_PUBLIC_TENANT_ID=dev-tenant
```

If these are not set, the frontend uses the values above automatically.
