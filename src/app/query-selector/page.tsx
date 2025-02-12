'use client';

import ExportType from '@/components/query-selector/export-type';
import { bulkServerURLState } from '@/state/bulk-server-url-state';
import { Grid, rem, Alert } from '@mantine/core';
import { IconExclamationCircle } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';

export default function QuerySelector() {
  const [dropdownData, setDropdownData] = useState<string[]>();
  const [error, setError] = useState<Error>();
  const bulkServerUrl = useRecoilValue(bulkServerURLState);
  const groupUrl = `${bulkServerUrl}/Group`;

  useEffect(() => {
    fetch(groupUrl)
      .then(response => response.json())
      .then((data: fhir4.Bundle) => {
        const entries = data.entry;
        const ids = entries?.map(entry => entry.resource?.id ?? '');
        setDropdownData(ids);
      })
      .catch(error => setError(error));
  }, []);

  return (
    <>
      {error ? (
        <Alert color="red" title="Error" radius="lg" fw={700} icon={<IconExclamationCircle />}>
          {error.message} -- Make sure you have the bulk export server running.
        </Alert>
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
          <ExportType exportType="measure-bundle" />
        </Grid>
      )}
    </>
  );
}
