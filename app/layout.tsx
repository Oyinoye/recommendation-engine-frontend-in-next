import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Segment-to-Context Dashboard',
  description: 'Real-time event stream and AI persona viewer',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
