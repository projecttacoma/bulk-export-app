import { Center, Tooltip, Button } from '@mantine/core';
import Link from 'next/link';
import classes from './componentStyles/export-type.module.css';
import { SupportedExportTypes } from './export-type';

export interface BuildQueryButtonProps {
  queryId: string | null;
  dropdown: SupportedExportTypes;
}

/**
 *  Component for the build query button at the bottom of each export-type component
 *  navigates to the next page, and creates the query string
 *
 */
export default function BuildQueryButton({ queryId, dropdown }: BuildQueryButtonProps) {
  if (dropdown === 'system') {
    return (
      <Center className={classes.buttonContainer}>
        <Button
          component={Link}
          href={{
            pathname: '/query-builder',
            query: { type: dropdown }
          }}
          className={classes.queryButton}
          size="lg"
        >
          Build Query
        </Button>
      </Center>
    );
  }
  return (
    <Center className={classes.buttonContainer}>
      <Tooltip label="Please select an ID" disabled={queryId ? true : false}>
        <Button
          component={Link}
          href={{
            pathname: '/query-builder',
            query: { type: dropdown, id: queryId }
          }}
          className={classes.queryButton}
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
