import type { Metadata } from 'next';
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import RecoilContext from './recoilContext';

export const metadata: Metadata = {
  title: 'bulk-data-app',
  description: 'Interactive query generator'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <RecoilContext>
          <MantineProvider>{children}</MantineProvider>
        </RecoilContext>
      </body>
    </html>
  );
}
