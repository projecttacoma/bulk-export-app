import { Box, Group, Mark, Title } from '@mantine/core';
import classes from '@/app/global.module.css';
import Link from 'next/link';
import { bulkServerURLState } from '@/state/bulk-server-url-state';
import { useRecoilValue } from 'recoil';

/*
 * Component for the application header to be shared across all pages.
 */
export default function ApplicationHeader() {
  const bulkServerUrl = useRecoilValue(bulkServerURLState);
  return (
    <Group justify="space-between" mr="xl">
      <Group m="sm">
        <Box component={Link} href="/" className={classes.appHeaderTitle}>
          <Title>Bulk-export-app</Title>
        </Box>
      </Group>
      {bulkServerURLState ? (
        <Title order={4}>
          Bulk Export Server Location: <Mark className={classes.blueText}>{bulkServerUrl}</Mark>
        </Title>
      ) : (
        <Link href={'/'}>Reset</Link>
      )}
    </Group>
  );
}
