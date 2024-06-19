import ExportType from '@/components/query-selector/export-type';
import { Grid, rem } from '@mantine/core';

export default async function QuerySelector() {
  return (
    <Grid justify="center" align="center" gutter={{ base: 5, xs: 'md', md: 'lg', xl: 50 }} style={{ margin: rem(60) }}>
      <ExportType name="patient" dropdownData={await getPatientIds()} />
      <ExportType name="group" dropdownData={await getGroupIds()} />
      <ExportType name="system" />
    </Grid>
  );
}

async function getPatientIds() {
  const data = await fetch(`${process.env.NEXT_PUBLIC_HOST}:${process.env.NEXT_PUBLIC_PORT}/Patient`);
  const patientData: fhir4.Patient[] = await data.json();
  // patient.id will never be null, according to fhir spec, this is just to make type checker happy.
  const patientIDs = patientData.map(patient => patient.id ?? '');

  return patientIDs;
}

async function getGroupIds() {
  const data = await fetch(`${process.env.NEXT_PUBLIC_HOST}:${process.env.NEXT_PUBLIC_PORT}/Group`);
  const groupData: fhir4.Group[] = await data.json();
  // group.id will never be null, according to fhir spec, this is just to make type checker happy.
  const groupIDs = groupData.map(group => group.id ?? '');

  return groupIDs;
}
