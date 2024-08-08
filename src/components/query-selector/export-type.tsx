'use client';
import { Card, Center, GridCol, rem, Select, Stack, Title } from '@mantine/core';
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
  const [queryId, setQueryId] = useState<string | null>(null);

  return (
    <GridCol span={{ base: 12, md: 6, lg: 3 }} style={{ minWidth: rem(600) }}>
      <Card radius="xl">
        <Stack>
          <Center>
            <Title>{`${capitalize(exportType)}-level Export`}</Title>
          </Center>
          {exportType === 'group' && (
            <Select
              size="lg"
              radius="md"
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
      </Card>
    </GridCol>
  );
}
