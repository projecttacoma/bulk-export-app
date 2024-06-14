'use client';
import { Center, Tooltip, Button } from '@mantine/core';
import Link from 'next/link';
import classes from './componentStyles/export-type.module.css';
import { SupportedExportTypes } from './export-type';
import { useRecoilState } from 'recoil';
import { baseQueryStringState } from '@/state/selected-query-string';
import { capitalizeFirstLetter } from '@/util/string-utility-functions';

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
  const [baseQueryString, setString] = useRecoilState(baseQueryStringState);

  if (dropdown === 'system') {
    return (
      <Center className={classes.buttonContainer}>
        <Button
          component={Link}
          href="/query-builder"
          onClick={() => {
            console.log('button clicked');
            setString('http://localhost:3000/');
            console.log(baseQueryString);
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
          href="/query-builder"
          className={classes.queryButton}
          data-disabled={queryId ? false : true}
          onClick={event => {
            setString(`http://localhost:3000/${capitalizeFirstLetter(dropdown)}/${queryId}`);
            console.log(baseQueryString);
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
