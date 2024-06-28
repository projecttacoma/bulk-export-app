import ExportType from '@/components/query-selector/export-type';
import { Grid, rem } from '@mantine/core';

export default async function QuerySelector() {
  return (
    <Grid justify="center" align="center" gutter={{ base: 5, xs: 'md', md: 'lg', xl: 50 }} style={{ margin: rem(60) }}>
      <ExportType exportType="patient" />
      <ExportType exportType="group" dropdownData={await getGroupIds()} />
      <ExportType exportType="system" />
    </Grid>
  );
}

// Function to get Group Ids from bulk export server
async function getGroupIds() {
  const url = `${process.env.NEXT_PUBLIC_HOST}:${process.env.NEXT_PUBLIC_PORT}/Group`;
  const response = await fetch(url);
  const resourceBundle: fhir4.Bundle = await response.json();
  const entries = resourceBundle.entry ?? [];
  const ids = entries.map(entry => entry.resource?.id ?? '');

  return ids;
}
