import ExportType from '@/components/query-selector/export-type';
import { Grid, rem } from '@mantine/core';

export default async function QuerySelector() {
  return (
    <Grid justify="center" align="center" gutter={{ base: 5, xs: 'md', md: 'lg', xl: 50 }} style={{ margin: rem(60) }}>
      <ExportType exportType="patient" dropdownData={await getIds('Patient')} />
      <ExportType exportType="group" dropdownData={await getIds('Group')} />
      <ExportType exportType="system" />
    </Grid>
  );
}

// Function to get Patient or Group Ids from bulk export server
async function getIds(name: 'Group' | 'Patient') {
  const url = `${process.env.NEXT_PUBLIC_HOST}:${process.env.NEXT_PUBLIC_PORT}/${name}`;
  const response = await fetch(url);
  const resourceBundle: fhir4.Bundle = await response.json();
  const entries = resourceBundle.entry ?? [];
  const ids = entries.map(entry => entry.resource?.id ?? '');

  return ids;
}
