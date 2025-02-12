'use client';
import { Card, Center, GridCol, rem, Select, Stack, Title } from '@mantine/core';
import { useState } from 'react';
import BuildQueryButton from './build-query-button';
import { capitalize } from 'lodash';
import MeasureFileUpload from './measure-file-upload';

export type SupportedExportTypes = 'patient' | 'group' | 'system' | 'measure-bundle';

export interface ExportTypeProps {
  exportType: SupportedExportTypes;
  dropdownData?: string[];
}

/*
 * Component for selecting which type of export the user wants.
 */
export default function ExportType({ exportType, dropdownData }: ExportTypeProps) {
  const [queryId, setQueryId] = useState<string | null>(null);

  const handleQueryIdChange = (newQueryId: string | null) => {
    setQueryId(newQueryId);
  };

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
          {exportType === 'measure-bundle' && <MeasureFileUpload onQueryIdChange={handleQueryIdChange} />}
          <BuildQueryButton queryId={queryId} exportType={exportType} />
        </Stack>
      </Card>
    </GridCol>
  );
}
