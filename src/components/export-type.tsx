'use client';

import { Center, Grid, Paper, rem, Stack, Title } from '@mantine/core';
import classes from './componentStyles/export-type.module.css';
import { useState } from 'react';
import BuildQueryButton from './build-query-button';
import { capitalizeFirstLetter } from '../util/string-utility-functions';
import Dropdown from './dropdown';

export type SupportedExportTypes = 'patient' | 'group' | 'system';
export interface ExportTypeProps {
  name: SupportedExportTypes;
}

export default function ExportType({ name }: ExportTypeProps) {
  const [queryId, setQueryId] = useState<string | null>('');

  return (
    <Grid.Col span={{ base: 12, md: 6, lg: 3 }} style={{ minWidth: rem(600) }}>
      <Paper shadow="xl" radius="xl" p="xl" className={classes.paper_background}>
        <Stack className={classes.card}>
          <Center>
            <Title className={classes.title}>{`${capitalizeFirstLetter(name)}-level Export`}</Title>
          </Center>
          <Dropdown dropdownType={name} getQueryIdFromDropdown={setQueryId} />
          <BuildQueryButton queryId={queryId} dropdown={name} />
        </Stack>
      </Paper>
    </Grid.Col>
  );
}
