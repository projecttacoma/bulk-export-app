import { BuilderRequest, buildExportRequestString } from '@/util/exportRequestBuilders';
import { ActionIcon, Flex, Text } from '@mantine/core';
import { IconArrowBack } from '@tabler/icons-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function ExecutionPage({ searchParams }: { searchParams: BuilderRequest }) {
  if (Object.keys(searchParams).length === 0) notFound();

  const { exportType, id } = searchParams;
  const { contentLocation, status } = await executeKickoff(searchParams);

  return (
    <Flex gap="lg">
      <ActionIcon
        component={Link}
        href={{ pathname: '/query-builder', query: id ? { type: exportType, id: id } : { type: exportType } }}
      >
        <IconArrowBack></IconArrowBack>
      </ActionIcon>
      <Text>{`${status} : ${contentLocation}`}</Text>
    </Flex>
  );
}

async function executeKickoff(request: BuilderRequest) {
  const exportRequestString = buildExportRequestString(request);
  console.log(exportRequestString);
  const response = await fetch(exportRequestString);
  const headers = response.headers;
  const status = response.status;
  const contentLocation = headers.get('content-location');
  return { contentLocation, status };
}
