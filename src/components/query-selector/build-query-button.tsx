import { Center, Tooltip, Button } from '@mantine/core';
import Link from 'next/link';
import { SupportedExportTypes } from './export-type';

export interface BuildQueryButtonProps {
  queryId: string | null;
  exportType: SupportedExportTypes;
}

/*
 *  Component for the build query button at the bottom of each export-type component
 *  navigates to the next page, and creates the query string
 */
export default function BuildQueryButton({ queryId, exportType }: BuildQueryButtonProps) {
  const buttonEnabled = exportType === 'system' || queryId !== null;

  return (
    <Center>
      <Tooltip label="Please select an ID" disabled={buttonEnabled}>
        <Button
          component={Link}
          href={{
            pathname: '/query-builder',
            query: exportType === 'system' ? { exportType: exportType } : { exportType: exportType, id: queryId }
          }}
          data-disabled={!buttonEnabled}
          onClick={event => {
            buttonEnabled ? event : event.preventDefault();
          }}
          size="lg"
        >
          Build Query
        </Button>
      </Tooltip>
    </Center>
  );
}
