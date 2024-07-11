'use client';

import { Anchor, Group, Title, Center, Loader, Card, Grid, GridCol } from '@mantine/core';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import RequestedFiles from '@/components/export-execution/requested-files';
import { IconChevronUp, IconChevronDown } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import ExportStatusInfo from '@/components/export-execution/export-status-info';

/*
 * Limit for the number of times the app can send a request to the bulk-export-server to try to get data at a content location.
 */
const FETCH_RETRY_LIMIT = 10;

export interface BulkExportResponse {
  type: string;
  url: string;
}
export interface PollingLog {
  retryAfter: string;
  xProgress: string;
}

export default function ExecutionPage() {
  const [bulkExportData, setBulkExportData] = useState<BulkExportResponse[]>([]);
  const [pollingLogs, setPollingLogs] = useState<PollingLog[]>([]);
  const [bulkDataLoading, setBulkDataLoading] = useState(true);
  const [requestedFilesOpened, { toggle }] = useDisclosure(true);

  const [bulkExportData, setBulkExportData] = useState<BulkExportResponse[]>([]);
  const [pollingLogs, setPollingLogs] = useState<PollingLog[]>([]);
  const [bulkDataLoading, setBulkDataLoading] = useState(true);
  const [requestedFilesOpened, { toggle }] = useDisclosure(true);

  const searchParams = useSearchParams();
  const encodedContentLocation = searchParams.get('contentLocation');
  if (!encodedContentLocation) return <Title>Error: Bad contentLocation</Title>;
  if (!encodedContentLocation) return <Title>Error: Bad contentLocation</Title>;
  const contentLocation = decodeURIComponent(encodedContentLocation);

  useEffect(() => {
    const getBulkStatus = async (retryLimit: number) => {
      if (retryLimit <= 0) {
        console.log('Retry limit of 10 hit. Stopping export...');
        return;
      }
      const response = await fetch(contentLocation);
      const xProgress = response.headers.get('x-progress');
      const retryAfterString = response.headers.get('retry-after');

      if (xProgress && retryAfterString) {
        const newLog: PollingLog = {
          retryAfter: retryAfterString,
          xProgress: xProgress
        };
        setPollingLogs(prevLogs => [...prevLogs, newLog]);

        const retryDelayMS = parseInt(retryAfterString, 10) * 1000;
        await new Promise(resolve => setTimeout(resolve, retryDelayMS));

        getBulkStatus(retryLimit - 1);
      } else {
        const data = await response.json();
        setBulkExportData(data.output);
        setBulkDataLoading(false);
      }
    };
    getBulkStatus(FETCH_RETRY_LIMIT);
  }, []);

  useEffect(() => {
    const getBulkStatus = async (retryLimit: number) => {
      if (retryLimit <= 0) {
        console.log('Retry limit of 10 hit. Stopping export...');
        return;
      }
      const response = await fetch(contentLocation);
      const xProgress = response.headers.get('x-progress');
      const retryAfterString = response.headers.get('retry-after');

      if (xProgress && retryAfterString) {
        const newLog: PollingLog = {
          retryAfter: retryAfterString,
          xProgress: xProgress
        };
        setPollingLogs(prevLogs => [...prevLogs, newLog]);

        const retryDelayMS = parseInt(retryAfterString, 10) * 1000;
        await new Promise(resolve => setTimeout(resolve, retryDelayMS));

        getBulkStatus(retryLimit - 1);
      } else {
        const data = await response.json();
        setBulkExportData(data.output);
        setBulkDataLoading(false);
      }
    };
    getBulkStatus(FETCH_RETRY_LIMIT);
  }, []);

  return (
    <Grid>
      <GridCol span={12}>
        <Card padding="xl" radius="md">
          <Title>Bulk Export Request Accepted</Title>
          <Group>
            <Title mr="lg" order={3} m="lg">
              Content Location:
            </Title>
            <Anchor href={contentLocation}>{contentLocation}</Anchor>
          </Group>
        </Card>
      </GridCol>
      <GridCol span="auto">
        <Card padding="xl" radius="md">
          <Group onClick={toggle} justify="space-between">
            <Title>Requested Files</Title>
            {requestedFilesOpened ? <IconChevronUp size={50} /> : <IconChevronDown size={50} />}
          </Group>
          {bulkDataLoading ? (
            <Center>
              <Loader />
            </Center>
          ) : (
            <RequestedFiles files={bulkExportData} opened={requestedFilesOpened} />
          )}
        </Card>
      </GridCol>
      <GridCol span={6}>
        <Card padding="xl" radius="md">
          <ExportStatusInfo logs={pollingLogs} bulkDataCompleted={!bulkDataLoading} />
        </Card>
      </GridCol>
    </Grid>
  );
}
