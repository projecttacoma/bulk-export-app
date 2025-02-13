'use client';

import {
  ActionIcon,
  Box,
  Card,
  Center,
  CopyButton,
  Group,
  Input,
  InputWrapper,
  Popover,
  rem,
  ScrollArea,
  TextInput,
  Title,
  Tooltip
} from '@mantine/core';
import { IconArrowRight, IconCheck, IconCopy, IconRefresh, IconSearch, IconZoomScan } from '@tabler/icons-react';
import { useRecoilValue } from 'recoil';
import { activeTypeParamsState } from '@/state/type-params-state';
import { BuilderRequestQueryParams, buildExportRequestString } from '@/util/exportRequestBuilder';
import { useSearchParams } from 'next/navigation';
import { SupportedExportTypes } from './query-selector/export-type';
import { useState } from 'react';
import Link from 'next/link';
import { activeElementParamsState } from '@/state/element-params-state';
import { activeTypeElementParamsState } from '@/state/type-element-params-state';
import { bulkServerURLState } from '@/state/bulk-server-url-state';
import { activeTypeFiltersState } from '@/state/selectors/type-filter-selectors';
import { organizeOutputByPatientState } from '@/state/organize-output-by-patient-state';
import { measureBundleState } from '@/state/measure-bundle';

/*
 * Component to visualize the Bulk-export request string.
 */
export default function QueryString() {
  const [contentLocation, setContentLocation] = useState<string | null>();
  const [status, setStatus] = useState<number>();
  const bulkExportBaseURL = useRecoilValue(bulkServerURLState);
  const typeParams = useRecoilValue(activeTypeParamsState);
  const typeElementParams = useRecoilValue(activeTypeElementParamsState);
  const elementParams = useRecoilValue(activeElementParamsState);
  const activeTypeFilters = useRecoilValue(activeTypeFiltersState);
  const organizeOutputByPatient = useRecoilValue(organizeOutputByPatientState);
  const measureBundle = useRecoilValue(measureBundleState);

  const searchParams = useSearchParams();
  const exportType = searchParams.get('exportType') as SupportedExportTypes;
  const id = searchParams.get('id');

  const queryParams: BuilderRequestQueryParams = {
    type: typeParams,
    element: elementParams,
    typeElement: typeElementParams,
    typeFilter: activeTypeFilters,
    organizeOutputByPatient: organizeOutputByPatient
  };
  const exportRequestString = buildExportRequestString({
    baseUrl: bulkExportBaseURL,
    exportType: exportType,
    id: id ?? undefined,
    queryParams: queryParams,
    customParams: measureBundle.queryText ?? undefined
  });

  const kickoffRequest = () => {
    fetch(exportRequestString)
      .then(response => {
        setContentLocation(response.headers.get('content-location'));
        setStatus(response.status);
      })
      .catch(err => {
        console.error(err);
      });
  };

  return (
    <Card w="75%" shadow="none">
      <InputWrapper>
        <Center mb="md">
          <Input.Label>
            <Title order={1}>Bulk Export Request</Title>
          </Input.Label>
        </Center>
        <TextInput
          size="lg"
          radius="xl"
          readOnly
          placeholder={exportRequestString}
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
          leftSectionWidth={80}
          leftSection={
            <Group gap="xs">
              <CopyButton value={exportRequestString} timeout={2000}>
                {({ copied, copy }) => (
                  <Tooltip label={copied ? 'Copied' : 'Copy'} withArrow position="right">
                    <ActionIcon color={copied ? 'teal' : 'gray'} variant="subtle" onClick={copy}>
                      {copied ? <IconCheck style={{ width: rem(16) }} /> : <IconCopy style={{ width: rem(16) }} />}
                    </ActionIcon>
                  </Tooltip>
                )}
              </CopyButton>
              <Popover withArrow position="top" radius="md" shadow="xl">
                <Popover.Dropdown w="50%">
                  <ScrollArea offsetScrollbars>
                    <Box>{exportRequestString.split('_').join('\n_')}</Box>
                  </ScrollArea>
                </Popover.Dropdown>
                <Popover.Target>
                  <Tooltip label="View export url" withArrow position="right">
                    <ActionIcon variant="subtle" color="gray">
                      <IconZoomScan />
                    </ActionIcon>
                  </Tooltip>
                </Popover.Target>
              </Popover>
            </Group>
          }
        />
      </InputWrapper>
    </Card>
  );
}
