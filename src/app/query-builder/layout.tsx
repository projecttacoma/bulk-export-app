import { AppShellFooter, AppShellHeader, AppShellMain, Box, Title } from '@mantine/core';
import Link from 'next/link';
import Providers from './providers';

import classes from './layout.module.css';

export default function BuilderLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <AppShellHeader>
        <Box component={Link} href="/query-selector" className={classes.appHeaderTitle}>
          <Title>Bulk-export-app</Title>
        </Box>
      </AppShellHeader>
      <AppShellMain>{children}</AppShellMain>
      <AppShellFooter></AppShellFooter>
    </Providers>
  );
}
