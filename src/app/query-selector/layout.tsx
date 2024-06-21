import { AppShell, AppShellFooter, AppShellHeader, AppShellMain, Box, Title } from '@mantine/core';
import classes from './page.module.css';
import Link from 'next/link';

export default function QuerySelectorLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell padding="md">
      <AppShellHeader>
        <Box component={Link} href="/query-selector" className={classes.title}>
          <Title>Bulk-export-app</Title>
        </Box>
      </AppShellHeader>
      <AppShellMain>{children}</AppShellMain>
      <AppShellFooter />
    </AppShell>
  );
}
