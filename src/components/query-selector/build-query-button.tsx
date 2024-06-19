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
  const toolTipDisabled = exportType === 'system' ? true : queryId ? true : false;
  const buttonDisabled = !toolTipDisabled;

  return (
    <Center>
      <Tooltip label="Please select an ID" disabled={toolTipDisabled}>
        <Button
          component={Link}
          href={{
            pathname: '/query-builder',
            query: exportType === 'system' ? { type: exportType } : { type: exportType, id: queryId }
          }}
          data-disabled={buttonDisabled}
          onClick={event => {
            buttonDisabled ? event.preventDefault() : event;
          }}
          size="lg"
        >
          Build Query
        </Button>
      </Tooltip>
    </Center>
  );
}
