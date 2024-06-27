'use client';

import { AppShell } from '@mantine/core';
import React from 'react';
import { RecoilRoot } from 'recoil';

/*
 * Component to wrap layout content in the providers that need to be client components
 */
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <RecoilRoot>
      <AppShell padding="md" header={{ height: 60 }}>
        {children}
      </AppShell>
    </RecoilRoot>
  );
}
