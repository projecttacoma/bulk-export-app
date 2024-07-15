import { AppShell, AppShellHeader, AppShellMain, Box, Title } from '@mantine/core';
import Link from 'next/link';
import React, { Suspense } from 'react';
import classes from '@/app/global.module.css';

export default function ExecutionLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell p="md" bg="gray.1" header={{ height: 63 }}>
      <AppShellHeader>
        <Box component={Link} href="/query-selector" className={classes.appHeaderTitle}>
          <Title>Bulk-export-app</Title>
        </Box>
      </AppShellHeader>
      <AppShellMain>
        <Suspense>{children}</Suspense>
      </AppShellMain>
    </AppShell>
  );
}
