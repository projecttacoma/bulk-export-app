import { AppShellFooter, AppShellHeader, AppShellMain, Box, Title } from '@mantine/core';
import classes from './layout.module.css';

import Link from 'next/link';
import ParamsTable from '@/components/query-params-table';
import Providers from './providers';

export default function BuilderLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <AppShellHeader>
        <Box component={Link} href="/query-selector" className={classes.title}>
          <Title>Bulk-export-app</Title>
        </Box>
      </AppShellHeader>
      <AppShellMain>{children}</AppShellMain>
      <AppShellFooter>
        <ParamsTable />
      </AppShellFooter>
    </Providers>
  );
}
