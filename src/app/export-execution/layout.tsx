'use client';

import { AppShell, AppShellHeader, AppShellMain } from '@mantine/core';
import React, { Suspense } from 'react';
import ApplicationHeader from '@/components/header';

export default function ExecutionLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell p="md" bg="gray.1" header={{ height: 63 }}>
      <AppShellHeader>
        <ApplicationHeader />
      </AppShellHeader>
      <AppShellMain>
        <Suspense>{children}</Suspense>
      </AppShellMain>
    </AppShell>
  );
}
