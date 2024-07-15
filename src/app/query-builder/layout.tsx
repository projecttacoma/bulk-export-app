'use client';

import { AppShell, AppShellHeader, AppShellMain, Box, Title } from '@mantine/core';
import Link from 'next/link';
import classes from '@/app/global.module.css';
import { RecoilRoot } from 'recoil';

export default function BuilderLayout({ children }: { children: React.ReactNode }) {
  return (
    <RecoilRoot>
      <AppShell padding="md" header={{ height: 60 }}>
        <AppShellHeader>
          <Box component={Link} href="/query-selector" className={classes.appHeaderTitle}>
            <Title>Bulk-export-app</Title>
          </Box>
        </AppShellHeader>
        <AppShellMain>{children}</AppShellMain>
      </AppShell>
    </RecoilRoot>
  );
}
