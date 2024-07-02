'use client';

import { ActionIcon, CopyButton, InputWrapper, rem, TextInput, Title, Tooltip } from '@mantine/core';
import { IconArrowRight, IconCheck, IconCopy, IconRefresh, IconSearch } from '@tabler/icons-react';
import { useRecoilValue } from 'recoil';
import { activeTypeParamsState } from '@/state/type-params-state';
import { buildExportRequestString } from '@/util/exportRequestBuilders';
import { useSearchParams } from 'next/navigation';
import { SupportedExportTypes } from './query-selector/export-type';
import { useState } from 'react';
import Link from 'next/link';

/*
 * Component to visualize the Bulk-export request string.
 */
export default function QueryString() {
  const [contentLocation, setContentLocation] = useState<string | null>();
  const [status, setStatus] = useState<number>();
  const typeParams = useRecoilValue(activeTypeParamsState);
  const searchParams = useSearchParams();
  const exportType = searchParams.get('exportType') as SupportedExportTypes;
  const id = searchParams.get('id');

  const exportRequestString = buildExportRequestString({ exportType, id, typeParams });

  const kickoffRequest = () => {
    fetch(exportRequestString).then(response => {
      setContentLocation(response.headers.get('content-location'));
      setStatus(response.status);
    });
  };
  return (
    <>
      <InputWrapper w="75%">
        <TextInput
          size="lg"
          radius="xl"
          placeholder={exportRequestString}
          label={<Title order={1}>Bulk Export Request</Title>}
          rightSection={
            <>
              {status ? (
                status === 202 ? (
                  <Tooltip label="Success: view status of query" withArrow position="right">
                    <ActionIcon
                      component={Link}
                      href={{
                        pathname: '/export-execution',
                        query: { contentLocation: encodeURIComponent(contentLocation ?? '') }
                      }}
                      size={48}
                      radius="xl"
                      color="green"
                    >
                      <IconSearch size={32} stroke={2} />
                    </ActionIcon>
                  </Tooltip>
                ) : (
                  <Tooltip label="Failure: fix query" withArrow position="right">
                    <ActionIcon size={48} radius="xl" onClick={kickoffRequest} color="red">
                      <IconRefresh size={32} stroke={2} />
                    </ActionIcon>
                  </Tooltip>
                )
              ) : (
                <Tooltip label="Click to run kickoff" withArrow position="right">
                  <ActionIcon size={48} radius="xl" onClick={kickoffRequest}>
                    <IconArrowRight size={32} stroke={2} />
                  </ActionIcon>
                </Tooltip>
              )}
            </>
          }
          leftSection={
            <CopyButton value={exportRequestString} timeout={2000}>
              {({ copied, copy }) => (
                <Tooltip label={copied ? 'Copied' : 'Copy'} withArrow position="right">
                  <ActionIcon color={copied ? 'teal' : 'gray'} variant="subtle" onClick={copy}>
                    {copied ? <IconCheck style={{ width: rem(16) }} /> : <IconCopy style={{ width: rem(16) }} />}
                  </ActionIcon>
                </Tooltip>
              )}
            </CopyButton>
          }
        />
      </InputWrapper>
    </>
  );
}
