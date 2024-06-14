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
  if (dropdown === 'system') {
    return (
      <Center>
        <Button
          component={Link}
          href={{
            pathname: '/query-builder',
            query: { type: dropdown }
          }}
          size="lg"
        >
          Build Query
        </Button>
      </Center>
    );
  }
  return (
    <Center>
      <Tooltip label="Please select an ID" disabled={queryId ? true : false}>
        <Button
          component={Link}
          href={{
            pathname: '/query-builder',
            query: { type: dropdown, id: queryId }
          }}
          data-disabled={queryId ? false : true}
          onClick={event => {
            queryId ? event : event.preventDefault();
          }}
          size="lg"
        >
          Build Query
        </Button>
      </Tooltip>
    </Center>
  );
}
