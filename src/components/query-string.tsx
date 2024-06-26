'use client';

import { ActionIcon, CopyButton, InputWrapper, rem, TextInput, Title, Tooltip } from '@mantine/core';
import { IconArrowRight, IconCheck, IconCopy } from '@tabler/icons-react';
import { useSearchParams } from 'next/navigation';
import { useRecoilValue } from 'recoil';
import { activeTypeParamsState } from '@/state/type-params-state';
import { SupportedExportTypes } from './query-selector/export-type';
import { buildExportRequestString } from '@/util/exportRequestBuilders';

export default function QueryString() {
  const typeParams = useRecoilValue(activeTypeParamsState);
  const searchParams = useSearchParams();

  const exportType = searchParams.get('type') as SupportedExportTypes;
  const id = searchParams.get('id');
  const exportRequestString = buildExportRequestString({ exportType, id, typeParams });

  return (
    <InputWrapper w="75%">
      <TextInput
        size="lg"
        radius="xl"
        placeholder={exportRequestString}
        label={<Title order={1}>Bulk Export Request</Title>}
        rightSection={
          <Tooltip label="Continue to run query" withArrow position="right">
            <ActionIcon size={48} radius="xl">
              <IconArrowRight size={32} stroke={2} />
            </ActionIcon>
          </Tooltip>
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
  );
}
