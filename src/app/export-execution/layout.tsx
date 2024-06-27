import { AppShell, AppShellHeader, AppShellMain, Box, Title } from '@mantine/core';
import Link from 'next/link';
import React from 'react';

import classes from '../query-builder/layout.module.css';

export default function ExecutionLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell p="md" header={{ height: 60 }}>
      <AppShellHeader>
        <Box component={Link} href="/query-selector" className={classes.appHeaderTitle}>
          <Title>Bulk-export-app</Title>
        </Box>
      </AppShellHeader>
      <AppShellMain>{children}</AppShellMain>
    </AppShell>
  );
}
