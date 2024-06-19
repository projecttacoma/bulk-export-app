import { Center, Tooltip, Button } from '@mantine/core';
import Link from 'next/link';
import { SupportedExportTypes } from './export-type';

export interface BuildQueryButtonProps {
  queryId: string | null;
  dropdown: SupportedExportTypes;
}

/*
 *  Component for the build query button at the bottom of each export-type component
 *  navigates to the next page, and creates the query string
 *
 */
export default function BuildQueryButton({ queryId, dropdown }: BuildQueryButtonProps) {
  const toolTipDisabled = dropdown === 'system' ? true : queryId ? true : false;
  const buttonDisabled = !toolTipDisabled;
  return (
    <Center>
      <Tooltip label="Please select an ID" disabled={toolTipDisabled}>
        <Button
          component={Link}
          href={{
            pathname: '/query-builder',
            query: dropdown === 'system' ? { type: dropdown } : { type: dropdown, id: queryId }
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
