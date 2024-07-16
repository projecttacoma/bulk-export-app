import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { Notifications } from '@mantine/notifications';

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
        <MantineProvider>
          <Notifications />
          <DynamicProviders>{children}</DynamicProviders>
        </MantineProvider>
      </body>
    </html>
  );
}
