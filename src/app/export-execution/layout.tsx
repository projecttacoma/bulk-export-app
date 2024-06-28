import { ActionIcon, AppShell, AppShellHeader, AppShellMain, AppShellNavbar, Box, Title } from '@mantine/core';
import Link from 'next/link';
import React from 'react';

import classes from '../query-builder/layout.module.css';
import { IconArrowBack } from '@tabler/icons-react';

export default function ExecutionLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell p="md" header={{ height: 60 }} navbar={{ width: 100, breakpoint: 0 }}>
      <AppShellHeader>
        <Box component={Link} href="/query-selector" className={classes.appHeaderTitle}>
          <Title>Bulk-export-app</Title>
        </Box>
      </AppShellHeader>
      <AppShellNavbar>
        <ActionIcon component={Link} href={{ pathname: '/query-selector' }}>
          <IconArrowBack></IconArrowBack>
        </ActionIcon>
      </AppShellNavbar>
      <AppShellMain>{children}</AppShellMain>
    </AppShell>
  );
}
