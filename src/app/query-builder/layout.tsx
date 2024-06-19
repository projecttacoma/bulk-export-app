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
import ParameterRows from '@/components/param-rows';

export default function BuilderLayout({ children }: { children: React.ReactNode }) {
  return (
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
              <ParameterRows />
            </TableTbody>
          </Table>
        </TableScrollContainer>
      </AppShellFooter>
    </AppShell>
  );
}
