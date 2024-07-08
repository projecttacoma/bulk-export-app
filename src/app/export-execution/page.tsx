'use client';

import { Anchor, Flex, Text, Stack, Title } from '@mantine/core';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import FileDownloadCollapse from '@/components/export-execution/file-downloads';
import { IconChevronUp, IconChevronDown } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import PollingLogsList from '@/components/export-execution/polling-logs';

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
  const [filesOpened, { toggle }] = useDisclosure(true);

  const searchParams = useSearchParams();
  const encodedContentLocation = searchParams.get('contentLocation');
  if (!encodedContentLocation) return <Title>Error: Bad contentLocation</Title>;
  const contentLocation = decodeURIComponent(encodedContentLocation);

  useEffect(() => {
    const getBulkStatus = async () => {
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

        getBulkStatus();
      } else {
        const data = await response.json();
        setBulkExportData(data.output);
        setBulkDataLoading(false);
      }
    };
    getBulkStatus();
  }, []);

  return (
    <Stack>
      <Title>Bulk Export Request Accepted</Title>
      <Flex>
        <Title mr="lg" order={3}>
          Content Location:
        </Title>
        <Anchor href={contentLocation}>{contentLocation}</Anchor>
      </Flex>
      <Flex onClick={toggle}>
        <Title>Requested Files</Title>
        {filesOpened ? <IconChevronUp size={50}></IconChevronUp> : <IconChevronDown size={50}></IconChevronDown>}
      </Flex>
      {bulkDataLoading ? (
        <Text>No data yet...</Text>
      ) : (
        <FileDownloadCollapse files={bulkExportData} opened={filesOpened} />
      )}
      <PollingLogsList logs={pollingLogs} bulkDataCompleted={!bulkDataLoading}></PollingLogsList>
    </Stack>
  );
}
