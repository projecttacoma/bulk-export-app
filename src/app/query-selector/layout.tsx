'use client';
import { AppShell, AppShellFooter, AppShellHeader, AppShellMain } from '@mantine/core';
import ApplicationHeader from '@/components/header';

export default function QuerySelectorLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell padding="md" header={{ height: '63px' }}>
      <AppShellHeader>
        <ApplicationHeader />
      </AppShellHeader>
      <AppShellMain>{children}</AppShellMain>
      <AppShellFooter />
    </AppShell>
  );
}
