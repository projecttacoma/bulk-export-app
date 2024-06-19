'use client';
import { Center, GridCol, Paper, rem, Select, Stack, Title } from '@mantine/core';
import { useState } from 'react';
import BuildQueryButton from './build-query-button';
import { capitalize } from 'lodash';

export type SupportedExportTypes = 'patient' | 'group' | 'system';

export interface ExportTypeProps {
  exportType: SupportedExportTypes;
  dropdownData?: string[];
}

/*
 * Component for selecting which type of export the user wants.
 */
export default function ExportType({ exportType, dropdownData }: ExportTypeProps) {
  const [queryId, setQueryId] = useState<string | null>('');

  return (
    <GridCol span={{ base: 12, md: 6, lg: 3 }} style={{ minWidth: rem(600) }}>
      <Paper shadow="xl" radius="xl" p="xl">
        <Stack>
          <Center>
            <Title>{`${capitalize(exportType)}-level Export`}</Title>
          </Center>
          {exportType == 'system' ? (
            <></>
          ) : (
            <Select
              size="lg"
              radius="lg"
              label={`${capitalize(exportType)} Id`}
              placeholder="Search for an Id"
              data={dropdownData}
              searchable
              nothingFoundMessage="Nothing found..."
              value={queryId}
              onChange={setQueryId}
            />
          )}
          <BuildQueryButton queryId={queryId} exportType={exportType} />
        </Stack>
      </Paper>
    </GridCol>
  );
}
