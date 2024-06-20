import ExportType from '@/components/query-selector/export-type';
import { Grid, rem } from '@mantine/core';

export default async function QuerySelector() {
  return (
    <Grid justify="center" align="center" gutter={{ base: 5, xs: 'md', md: 'lg', xl: 50 }} style={{ margin: rem(60) }}>
      <ExportType exportType="patient" dropdownData={await getPatientIds()} />
      <ExportType exportType="group" dropdownData={await getGroupIds()} />
      <ExportType exportType="system" />
    </Grid>
  );
}

// Function to get all Patient ids from the bulk-data-server Patient endpoint
async function getPatientIds() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}:${process.env.NEXT_PUBLIC_PORT}/Patient`);
  const patientResourceBundle: fhir4.Bundle = await response.json();
  const patientResources = patientResourceBundle.entry;
  const patientIDs = patientResources?.map(patient => patient.resource?.id ?? '');

  return patientIDs;
}

// Function to get all Group ids from the bulk-data-server Group endpoint
async function getGroupIds() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}:${process.env.NEXT_PUBLIC_PORT}/Group`);
  const groupResourceBundle: fhir4.Bundle = await response.json();
  const groupResources = groupResourceBundle.entry;
  const groupIDs = groupResources?.map(group => group.resource?.id ?? '');

  return groupIDs;
}
