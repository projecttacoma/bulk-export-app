import { AppShell, AppShellFooter, AppShellHeader, AppShellMain, Text } from '@mantine/core';
import classes from './page.module.css';

export default function QuerySelectorLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell padding="md">
      <AppShellHeader>
        <Text component="a" href="/query-selector" className={classes.title}>
          Bulk-export-app
        </Text>
      </AppShellHeader>
      <AppShellMain>{children}</AppShellMain>
      <AppShellFooter />
    </AppShell>
  );
}
