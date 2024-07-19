import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

import { ColorSchemeScript } from '@mantine/core';
import { Metadata } from 'next';
import dynamic from 'next/dynamic';

export const metadata: Metadata = {
  title: 'bulk-data-app',
  description: 'Interactive bulk-export-server query generator'
};

const DynamicProviders = dynamic(() => import('./providers'), { ssr: false });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <DynamicProviders>{children}</DynamicProviders>
      </body>
    </html>
  );
}
