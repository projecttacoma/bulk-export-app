'use client';

import { Anchor, Flex, Pill, Stack, Title } from '@mantine/core';
import { useSearchParams } from 'next/navigation';

export default function ExecutionPage() {
  const searchParams = useSearchParams();

  const encodedContentLocation = searchParams.get('contentLocation');
  if (!encodedContentLocation) return <Title>Error: Bad content-location</Title>;
  const contentLocation = decodeURIComponent(encodedContentLocation);

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
    </Stack>
  );
}
