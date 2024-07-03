'use client';

import { Anchor, Flex, Stack, Title } from '@mantine/core';
import { useSearchParams } from 'next/navigation';

export default function ExecutionPage() {
  const searchParams = useSearchParams();

  const encodedContentLocation = searchParams.get('contentLocation');
  if (!encodedContentLocation) return <Title>Error: Bad content-location</Title>;
  const contentLocation = decodeURIComponent(encodedContentLocation);

  return (
    <Stack>
      <Flex>
        <Title mr="lg" order={3}>
          Content Location:
        </Title>
        {contentLocation && <Anchor href={contentLocation}>{contentLocation}</Anchor>}
      </Flex>
    </Stack>
  );
}
