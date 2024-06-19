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

// Function to get all Patient ids from the bulk-data-server patient endpoint
// Note: in the .map, patient.id will never be null, according to fhir spec. The null check is only needed for type checker.
async function getPatientIds() {
  const data = await fetch(`${process.env.NEXT_PUBLIC_HOST}:${process.env.NEXT_PUBLIC_PORT}/Patient`);
  const patientData: fhir4.Patient[] = await data.json();
  const patientIDs = patientData.map(patient => patient.id ?? '');

  return patientIDs;
}

// Function to get all Group ids from the bulk-data-server patient endpoint
// Note: in the .map, group.id will never be null, according to fhir spec. The null check is only needed for type checker.
async function getGroupIds() {
  const data = await fetch(`${process.env.NEXT_PUBLIC_HOST}:${process.env.NEXT_PUBLIC_PORT}/Group`);
  const groupData: fhir4.Group[] = await data.json();
  const groupIDs = groupData.map(group => group.id ?? '');

  return groupIDs;
}
