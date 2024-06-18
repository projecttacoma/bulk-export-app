import { Grid, rem } from '@mantine/core';
import ExportType from '../../components/export-type';

export default function QuerySelector() {
  return (
    <Grid justify="center" align="center" gutter={{ base: 5, xs: 'md', md: 'lg', xl: 50 }} style={{ margin: rem(60) }}>
      <ExportType name="patient" />
      <ExportType name="group" />
      <ExportType name="system" />
    </Grid>
  );
}
