'use client';

import {
  Group,
  Title,
  Center,
  Loader,
  Card,
  Grid,
  GridCol,
  Text,
  Stack,
  Collapse,
  Anchor,
  Tooltip
} from '@mantine/core';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import RequestedFiles from '@/components/export-execution/requested-files';
import { IconChevronUp, IconChevronDown, IconInfoCircle } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import ExportStatusInfo from '@/components/export-execution/export-status-info';
import { filesize } from 'filesize';
import { useRecoilState } from 'recoil';
import { ExportTiming, exportTimingState } from '@/state/export-timing-state';
import { PollingLog, pollingLogsState } from '@/state/polling-logs-state';

export interface TelemetryDataProps {
  numFiles: number;
  totalFileSize: number;
  timeAllFiles: number;
}
/*
 * Limit for the number of times the app can send a request to the bulk-export-server to try to get data at a content location.
 */
const FETCH_RETRY_LIMIT = 10;

export interface BulkExportResponse {
  type: string;
  url: string;
}

export default function ExecutionPage() {
  const [bulkExportData, setBulkExportData] = useState<BulkExportResponse[]>([]);
  const [pollingLogs, setPollingLogs] = useRecoilState(pollingLogsState);
  const [telemData, setTelemData] = useState<TelemetryDataProps>();
  const [exportTiming, setExportTiming] = useRecoilState(exportTimingState);

  const [bulkDataLoading, setBulkDataLoading] = useState(true);
  const [requestedFilesOpened, { toggle }] = useDisclosure(true);

  const searchParams = useSearchParams();
  const encodedContentLocation = searchParams.get('contentLocation');
  if (!encodedContentLocation) return <Title>Error: Bad contentLocation</Title>;
  const contentLocation = decodeURIComponent(encodedContentLocation);

  useEffect(() => {
    const getBulkStatus = async (retryLimit: number, start: number) => {
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
          xProgress: xProgress,
          response: response,
          exportRequestDateTime: new Date().toLocaleTimeString()
        };
        setPollingLogs(prevLogs => [...prevLogs, newLog]);

        const retryDelayMS = parseInt(retryAfterString, 10) * 1000;
        await new Promise(resolve => setTimeout(resolve, retryDelayMS));

        getBulkStatus(retryLimit - 1, start);
      } else {
        const data = await response.json();
        setExportTiming({ start: exportTiming?.start, end: exportTiming?.end ? exportTiming?.end : performance.now() });
        setBulkExportData(data.output);
        setBulkDataLoading(false);
      }
    };
    getBulkStatus(FETCH_RETRY_LIMIT, performance.now());
  }, []);

  return (
    <Grid>
      <GridCol span={{ base: 12, lg: 4 }}>
        <Stack>
          <Card padding="xl" radius="md">
            <Group align="flex-start" gap="sm">
              <Title order={2} mb="lg">
                Content Location
              </Title>
              <Tooltip label={'Location of the files on the server'}>
                <IconInfoCircle color="gray" />
              </Tooltip>
            </Group>
            <Anchor href={contentLocation}>{contentLocation}</Anchor>
          </Card>
          <Card padding="xl" radius="md">
            <ExportStatusInfo logs={pollingLogs} bulkDataCompleted={!bulkDataLoading} />
          </Card>
          <Card padding="xl" radius="md">
            <TelemetryData telemetryData={telemData} exportTime={exportTiming ?? undefined} />
          </Card>
        </Stack>
      </GridCol>
      <GridCol span="auto">
        <Card padding="xl" radius="md">
          <Group onClick={toggle} justify="space-between">
            <Title>Requested Files</Title>
            {requestedFilesOpened ? <IconChevronUp size={50} /> : <IconChevronDown size={50} />}
          </Group>
          {bulkDataLoading ? (
            <Center>
              <Text mr="md">Waiting for export to complete</Text>
              <Loader />
            </Center>
          ) : (
            <RequestedFiles files={bulkExportData} opened={requestedFilesOpened} setTelemData={setTelemData} />
          )}
        </Card>
      </GridCol>
    </Grid>
  );
}

function TelemetryData({
  telemetryData,
  exportTime
}: {
  telemetryData?: TelemetryDataProps;
  exportTime?: ExportTiming;
}) {
  const [telemOpen, { toggle }] = useDisclosure(true);

  const serverTimeToExport = (exportTime?.end ?? 0) - (exportTime?.start ?? 0);

  return (
    <>
      <Group justify="space-between" onClick={toggle}>
        <Group align="flex-end">
          <Title order={2}>Telemetry Data</Title>
        </Group>

        {telemOpen ? <IconChevronUp size={50} /> : <IconChevronDown size={50} />}
      </Group>
      <Collapse in={telemOpen}>
        {telemetryData && serverTimeToExport ? (
          <Stack mt="lg">
            <Text>
              Total number of files:{' '}
              <Text span inherit fw={600}>
                {telemetryData?.numFiles}
              </Text>
            </Text>
            <Text>
              Total filesize:{' '}
              <Text span inherit fw={600}>
                {filesize(telemetryData?.totalFileSize ?? 0)}
              </Text>
            </Text>
            <Text>
              Time to download and parse files:{' '}
              <Text span inherit fw={600}>
                {telemetryData?.timeAllFiles.toFixed(0)}ms
              </Text>
            </Text>
            <Text>
              Download Speed (filesize / time to parse):{' '}
              <Text span inherit fw={600}>
                {filesize((telemetryData?.totalFileSize / telemetryData?.timeAllFiles) * 1000)}/s
              </Text>
            </Text>

            <Text>
              Server export time (from kickoff request to request complete):{' '}
              <Text span inherit fw={600}>
                {serverTimeToExport.toFixed(0)}ms
              </Text>
            </Text>
            <Text>
              Server export speed (total file fize / server time to export):{' '}
              <Text span inherit fw={600}>
                {filesize((telemetryData.totalFileSize / serverTimeToExport) * 1000)}/s
              </Text>
            </Text>
          </Stack>
        ) : (
          <Center>
            <Text mr="md">Waiting for export to complete</Text>
            <Loader />
          </Center>
        )}
      </Collapse>
    </>
  );
}
