'use client';

import { Anchor, Flex, Pill, Stack, Title } from '@mantine/core';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { filesize } from 'filesize';
import FilesModal from '@/components/export-execution/files-modal';

export interface FileSizeInfo {
  name: string;
  url: string;
  size: string;
}
export interface TypeUrl {
  type: string;
  url: string;
}

export default function ExecutionPage() {
  const searchParams = useSearchParams();
  const [bulkExportData, setBulkExportData] = useState<TypeUrl[]>();

  const encodedContentLocation = searchParams.get('contentLocation');
  if (!encodedContentLocation) return <Title>Error: Bad content-location</Title>;
  const contentLocation = decodeURIComponent(encodedContentLocation);

  useEffect(() => {
    fetch(contentLocation)
      .then(response => response.json())
      .then(data => setBulkExportData(data.output));
  }, []);

  console.log(bulkExportData);

  return (
    <Stack>
      <Flex>
        <Title order={3} mr="lg">
          Status:
        </Title>
        <Pill size="xl" bg="green" c="white" fw={700}>
          202
        </Pill>
      </Flex>
      <Flex>
        <Title mr="lg" order={3}>
          Content Location:
        </Title>
        {contentLocation && <Anchor href={contentLocation}>{contentLocation}</Anchor>}
      </Flex>
      {bulkExportData && <FilesModal files={bulkExportData}></FilesModal>}
    </Stack>
  );
}
