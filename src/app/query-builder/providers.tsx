'use client';

import { AppShell } from '@mantine/core';
import React from 'react';
import { RecoilRoot } from 'recoil';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <RecoilRoot>
      <AppShell padding="md">{children}</AppShell>
    </RecoilRoot>
  );
}
