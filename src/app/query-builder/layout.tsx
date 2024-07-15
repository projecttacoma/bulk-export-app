'use client';

import { AppShell, AppShellHeader, AppShellMain } from '@mantine/core';
import ApplicationHeader from '@/components/header';

export default function BuilderLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell padding="md" header={{ height: 63 }}>
      <AppShellHeader>
        <ApplicationHeader />
      </AppShellHeader>
      <AppShellMain>{children}</AppShellMain>
    </AppShell>
  );
}
