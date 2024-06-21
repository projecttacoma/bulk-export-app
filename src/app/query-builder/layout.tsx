'use client';
import {
  AppShell,
  AppShellFooter,
  AppShellHeader,
  AppShellMain,
  Table,
  TableScrollContainer,
  TableTbody,
  TableTh,
  TableThead,
  TableTr,
  Text
} from '@mantine/core';
import classes from './layout.module.css';
import { RecoilRoot } from 'recoil';
import QueryParams from '@/components/query-params';

export default function BuilderLayout({ children }: { children: React.ReactNode }) {
  return (
    <RecoilRoot>
      <AppShell padding="md">
        <AppShellHeader>
          <Text component="a" href="/query-selector" className={classes.title}>
            Bulk-export-app
          </Text>
        </AppShellHeader>
        <AppShellMain>{children}</AppShellMain>
        <AppShellFooter>
          <TableScrollContainer minWidth={500} type="native" mah={300} mx="auto">
            <Table highlightOnHover stickyHeader>
              <TableThead>
                <TableTr>
                  <TableTh>Filter Type</TableTh>
                  <TableTh>Elements</TableTh>
                  <TableTh>Edit</TableTh>
                  <TableTh>Remove</TableTh>
                </TableTr>
              </TableThead>
              <TableTbody>
                <QueryParams />
              </TableTbody>
            </Table>
          </TableScrollContainer>
        </AppShellFooter>
      </AppShell>
    </RecoilRoot>
  );
}
