'use client';
import ExportType from '@/components/query-selector/export-type';
import { Grid, rem, Alert } from '@mantine/core';
import { IconExclamationCircle } from '@tabler/icons-react';
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
          <Alert color="red" title="Error" radius="lg" fw={700} icon={<IconExclamationCircle />}>
            {error.message} -- Make sure you have the bulk export server running.
          </Alert>
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
