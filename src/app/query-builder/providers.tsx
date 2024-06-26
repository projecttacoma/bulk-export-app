'use client';

import { AppShell } from '@mantine/core';
import React from 'react';
import { RecoilRoot } from 'recoil';

// Component to wrap layout in Recoil root and AppShell to avoid problems with
// making the layout a client component.
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <RecoilRoot>
      <AppShell padding="md" header={{ height: 60 }}>
        {children}
      </AppShell>
    </RecoilRoot>
  );
}
