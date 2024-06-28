import { BuilderRequest, buildExportRequestString } from '@/util/exportRequestBuilders';
import { Anchor, Flex, Pill, Stack, Title } from '@mantine/core';
import { notFound } from 'next/navigation';

export default async function ExecutionPage({ searchParams }: { searchParams: BuilderRequest }) {
  if (Object.keys(searchParams).length === 0) notFound();

  const kickoffRequestString = buildExportRequestString(searchParams);
  const kickoffResponse = await executeKickoff(kickoffRequestString);

  const contentLocation = kickoffResponse.headers.get('content-location');
  const status = kickoffResponse.status;

  // console.log(contentLocation);

  // const resources = await getResources(contentLocation);
  // const response = await fetchDataWithRetry(resources.url, 100);
  // const jsonResponse = await response?.json();
  // const output = jsonResponse.output;
  // const types = output.map(obj => obj.type);
  // console.log('this is res: ', jsonResponse);
  // console.log(output);
  // console.log(types);

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

        {/* <Stack>
          {output.map(obj => (
            <Text>
              {obj.type} : <Anchor>{obj.url} </Anchor>
            </Text>
          ))}
        </Stack> */}
      </Stack>
    </>
  );
}

async function executeKickoff(exportRequestString: string) {
  await new Promise(resolve => setTimeout(resolve, 2000));
  const response = await fetch(exportRequestString).catch(e => {
    console.log(e);
    notFound();
  });
  console.log('query run: ', exportRequestString);
  return response;
}

async function getResources(contentLocation: string) {
  const response = await fetch(contentLocation);
  const xProgress = response.headers.get('x-progress');
  const url = response.url;
  console.log(xProgress);
  if (!response.ok) {
    throw new Error('Error getting resources');
  }
  return { response, xProgress, url };
}
async function fetchDataWithRetry(url: string, retries = 5, delay = 1000) {
  try {
    const { response, xProgress } = await getResources(url);

    if (xProgress === 'Exporting files') {
      if (retries === 0) throw new Error('No data after retries');
      await new Promise(resolve => setTimeout(resolve, delay));
      return fetchDataWithRetry(url, retries - 1, delay);
    }

    return response;
  } catch (error) {
    console.error(error);
  }
}
