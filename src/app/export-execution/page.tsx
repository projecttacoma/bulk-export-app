'use client';
import { BuilderRequest, buildExportRequestString } from '@/util/exportRequestBuilders';
import { Anchor, Flex, Pill, Stack, Title } from '@mantine/core';
import { useEffect, useState } from 'react';

export default function ExecutionPage({ searchParams }: { searchParams: BuilderRequest }) {
  const [contentLocation, setContentLocation] = useState<string | null>();
  const [status, setStatus] = useState<number>();

  const exportRequestUrl = buildExportRequestString(searchParams);

  useEffect(() => {
    fetch(exportRequestUrl).then(response => {
      setContentLocation(response.headers.get('content-location'));
      setStatus(response.status);
    });
  }, []);

  return (
    <Stack>
      <Flex>
        <Title order={3} mr="lg">
          Status:
        </Title>
        {status && (
          <Pill size="xl" bg={status === 202 ? 'green' : 'red'} c="white" fw={700}>
            {status}
          </Pill>
        )}
      </Flex>
      <Flex>
        <Title mr="lg" order={3}>
          Content Location:
        </Title>
        {contentLocation && <Anchor href={contentLocation}>{contentLocation}</Anchor>}
      </Flex>
    </Stack>
  );
}
