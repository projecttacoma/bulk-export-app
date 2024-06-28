import { BuilderRequest, buildExportRequestString } from '@/util/exportRequestBuilders';
import { Anchor, Flex, Pill, Stack, Title } from '@mantine/core';
import { notFound } from 'next/navigation';

export default async function ExecutionPage({ searchParams }: { searchParams: BuilderRequest }) {
  // if you navigate to page not through app
  if (Object.keys(searchParams).length === 0) notFound();

  const kickoffRequestString = buildExportRequestString(searchParams);
  const kickoffResponse = await executeKickoff(kickoffRequestString);

  const contentLocation = kickoffResponse.headers.get('content-location');
  const status = kickoffResponse.status;

  return (
    <>
      <Stack>
        <Flex>
          <Title order={3} mr="lg">
            Status:
          </Title>
          <Pill size="xl" bg={status === 202 ? 'green' : 'red'} c="white" fw={700}>
            {status}
          </Pill>
        </Flex>
        {contentLocation && (
          <Flex>
            <Title mr="lg" order={3}>
              Content Location:
            </Title>
            <Anchor href={contentLocation}>{contentLocation}</Anchor>
          </Flex>
        )}
      </Stack>
    </>
  );
}

async function executeKickoff(exportRequestString: string) {
  const response = await fetch(exportRequestString).catch(e => {
    console.log(e);
    notFound();
  });
  return response;
}
