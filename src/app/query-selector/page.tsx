'use client';
import ExportType from '@/components/query-selector/export-type';
import { Grid, rem, Notification } from '@mantine/core';
import { useEffect, useState } from 'react';

export default function QuerySelector() {
  const [dropdownData, setDropdownData] = useState<string[]>();
  const [error, setError] = useState<Error>();
  const groupUrl = `${process.env.NEXT_PUBLIC_HOST}:${process.env.NEXT_PUBLIC_PORT}/Group`;

  useEffect(() => {
    fetch(groupUrl)
      .then(response => response.json())
      .then((data: fhir4.Bundle) => {
        const entries = data.entry;
        const ids = entries?.map(entry => entry.resource?.id ?? '');
        setDropdownData(ids);
      })
      .catch(error => {
        setError(error);
        console.error(error);
      });
  }, []);

  return (
    <>
      {error ? (
        <>
          <Notification color="red" title="Error" withCloseButton={false} fw={700}>
            {error.message} -- Make sure you have the bulk export server running.
          </Notification>
          ,
        </>
      ) : (
        <Grid
          justify="center"
          align="center"
          gutter={{ base: 5, xs: 'md', md: 'lg', xl: 50 }}
          style={{ margin: rem(60) }}
        >
          <ExportType exportType="patient" />
          <ExportType exportType="group" dropdownData={dropdownData} />
          <ExportType exportType="system" />
        </Grid>
      )}
    </>
  );
}
