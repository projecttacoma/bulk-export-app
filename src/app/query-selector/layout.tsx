'use client';

import { AppShell, Text } from '@mantine/core';
import classes from './page.module.css';

export default function QuerySelectorLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell padding="md">
      <AppShell.Header className={classes.header}>
        <Text component="a" href="/query-selector" className={classes.title}>
          Bulk-export-app
        </Text>
      </AppShell.Header>
      <AppShell.Main className={classes.mainPage}>{children}</AppShell.Main>
      <AppShell.Footer></AppShell.Footer>
    </AppShell>
  );
}
