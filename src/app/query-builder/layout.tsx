'use client';
import { AppShell, Title } from '@mantine/core';
import React from 'react';
import QueryString from '../../components/query-builder/query-string';
import ActiveFilters from '../../components/query-builder/active-filters';

export default function BuilderLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell padding="md">
      <AppShell.Header>
        <Title>Bulk-data-app</Title>
      </AppShell.Header>

      <AppShell.Main>
        <QueryString></QueryString>
        {children}
      </AppShell.Main>
      <AppShell.Footer>
        <ActiveFilters></ActiveFilters>
      </AppShell.Footer>
    </AppShell>
  );
}
