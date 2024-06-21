'use client';

import { ActionIcon, CopyButton, rem, TextInput, Tooltip } from '@mantine/core';
import { useSearchParams } from 'next/navigation';
import { IconArrowRight, IconCheck, IconCopy } from '@tabler/icons-react';
import { useRecoilValue } from 'recoil';
import { activeTypeParamsState } from '@/state/type-params-state';
import { toString } from 'lodash';
import { SupportedExportTypes } from './query-selector/export-type';

export default function QueryString() {
  const typeParams = useRecoilValue(activeTypeParamsState);
  const placeholder = buildQueryString(typeParams);

  return (
    <TextInput
      radius="xl"
      size="lg"
      placeholder={placeholder}
      rightSection={
        <Tooltip label="Continue to run query" withArrow position="right">
          <ActionIcon size={48} variant="filled" radius="xl">
            <IconArrowRight style={{ width: rem(24), height: rem(24) }} stroke={1.5} />
          </ActionIcon>
        </Tooltip>
      }
      leftSection={
        <CopyButton value={placeholder} timeout={2000}>
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
  );
}
function buildQueryString(params: string[]) {
  const baseUrl = `${process.env.NEXT_PUBLIC_HOST}:${process.env.NEXT_PUBLIC_PORT}`;
  const searchParams = useSearchParams();
  const exportType = searchParams.get('type') as SupportedExportTypes;
  const id = searchParams.get('id') ?? '';

  const queryString = params.length == 0 ? '' : '?_type=' + toString(params);
  if (exportType === 'system') {
    return baseUrl + '/$export' + queryString;
  } else if (exportType === 'patient') {
    return baseUrl + '/Patient/$export' + queryString;
  } else if (exportType === 'group') {
    return baseUrl + `/Group/${id}/$export` + queryString;
  }
  return '';
}
