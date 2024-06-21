'use client';
import { AppShell, AppShellFooter, AppShellHeader, AppShellMain, Box, Title } from '@mantine/core';
import classes from './layout.module.css';
import { RecoilRoot } from 'recoil';
import Link from 'next/link';
import ParamsTable from '@/components/query-params-table';

export default function BuilderLayout({ children }: { children: React.ReactNode }) {
  return (
    <RecoilRoot>
      <AppShell padding="md">
        <AppShellHeader>
          <Box component={Link} href="/query-selector" className={classes.title}>
            <Title>Bulk-export-app</Title>
          </Box>
        </AppShellHeader>
        <AppShellMain>{children}</AppShellMain>
        <AppShellFooter>
          <ParamsTable />
        </AppShellFooter>
      </AppShell>
    </RecoilRoot>
  );
}
