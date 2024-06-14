'use client';

import { Center, Grid, Paper, rem, Stack, Title } from '@mantine/core';
import { useState } from 'react';
import BuildQueryButton from './build-query-button';
import Dropdown from './dropdown';
import { capitalize } from 'lodash';

export type SupportedExportTypes = 'patient' | 'group' | 'system';
export interface ExportTypeProps {
  name: SupportedExportTypes;
}

/*
 * Component for selecting which type of export the user wants
 */
export default function ExportType({ name }: ExportTypeProps) {
  const [queryId, setQueryId] = useState<string | null>('');

  return (
    <Grid.Col span={{ base: 12, md: 6, lg: 3 }} style={{ minWidth: rem(600) }}>
      <Paper shadow="xl" radius="xl" p="xl">
        <Stack>
          <Center>
            <Title>{`${capitalize(name)}-level Export`}</Title>
          </Center>
          <Dropdown dropdownType={name} getQueryIdFromDropdown={setQueryId} />
          <BuildQueryButton queryId={queryId} dropdown={name} />
        </Stack>
      </Paper>
    </Grid.Col>
  );
}
