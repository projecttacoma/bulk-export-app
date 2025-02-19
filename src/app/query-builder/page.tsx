'use client';

import {
  Button,
  Card,
  Center,
  Container,
  Flex,
  ScrollArea,
  Tabs,
  TabsList,
  TabsPanel,
  TabsTab,
  Title,
  Tooltip
} from '@mantine/core';
import QueryString from '@/components/query-string';
import TypeParamsPage from '@/components/parameter-pages/type-params-page';
import { IconAlertCircle, IconCircleCheck, IconInfoCircle } from '@tabler/icons-react';
import { SupportedExportTypes } from '@/components/query-selector/export-type';
import { Suspense, useState } from 'react';
import ElementParamsPage from '@/components/parameter-pages/elements-params-page';
import TypeFilterParamsPage from '@/components/parameter-pages/type-filter-params-page';
import OrganizeOutputByPatientSwitch from '@/components/parameter-pages/organize-output-by-swtich';
import { showNotification } from '@mantine/notifications';
import { useRecoilValue } from 'recoil';
import { measureBundleState } from '@/state/measure-bundle';
import { useSearchParams } from 'next/navigation';
import { CodeHighlight } from '@mantine/code-highlight';
import { bulkServerURLState } from '@/state/bulk-server-url-state';
import Link from 'next/link';

/*
 * Properties of the query string that can be passed to this page
 */
export interface SearchParamsProps {
  exportType: SupportedExportTypes;
  id?: string;
}

export default function QueryBuilder() {
  const searchParams = useSearchParams();
  const measureBundle = useRecoilValue(measureBundleState);
  const bulkExportBaseURL = useRecoilValue(bulkServerURLState);
  const [groupId, setGroupId] = useState(null);

  const createGroup = () => {
    fetch(`${bulkExportBaseURL}/Group`, {
      method: 'POST',
      body: measureBundle.groupText,
      headers: { 'Content-Type': 'application/json+fhir' }
    })
      .then(response => response.json())
      .then(resObj => {
        setGroupId(resObj.id);
        showNotification({
          icon: <IconCircleCheck />,
          title: 'Group Creation Success',
          message: `Successfully created group at id ${resObj.id}`,
          color: 'green'
        });
      })
      .catch(err => {
        console.error(err);
        showNotification({
          icon: <IconAlertCircle />,
          title: 'Group Creation Failed',
          message: `Group creation failed with error: ${err}`,
          color: 'red'
        });
      });
  };

  return (
    <>
      <Center mt="xl">
        <Suspense>
          <QueryString />
        </Suspense>
      </Center>
      {searchParams.get('exportType') === 'measure-bundle' ? (
        <Card>
          <ScrollArea.Autosize mah={600} mx="auto" scrollbars="y" bd="1px solid gray.2" mr="lg" ml="lg" mt="lg" mb="lg">
            <CodeHighlight withCopyButton={true} code={measureBundle.groupText} language="json" />
          </ScrollArea.Autosize>
          {groupId ? (
            <Center>
              <Link href={`/query-builder?exportType=group&id=${groupId}`}>
                <Button disabled={!groupId}>Group Export</Button>
              </Link>
            </Center>
          ) : (
            <Center>
              <Button disabled={measureBundle.groupText === 'No group content'} onClick={createGroup}>
                Create
              </Button>
            </Center>
          )}
        </Card>
      ) : (
        <Card>
          <Container fluid m="xl">
            <Flex align="center" mb="lg">
              <Title mr="sm">Parameters</Title>
              <Tooltip
                position="right"
                withArrow
                transitionProps={{ duration: 200 }}
                label="Add parameters to your bulk export query"
              >
                <IconInfoCircle color="gray" />
              </Tooltip>
            </Flex>
            <Tabs defaultValue="type-tab" orientation="vertical" radius="md">
              <TabsList fw={600}>
                <TabsTab fz="h2" p="lg" value="type-tab">
                  Types
                </TabsTab>
                <TabsTab fz="h2" p="lg" value="element-tab">
                  Elements
                </TabsTab>
                <TabsTab fz="h2" p="lg" value="type-filters-tab">
                  Type Filters
                </TabsTab>
              </TabsList>
              <TabsPanel ml="xl" value="type-tab">
                <TypeParamsPage />
              </TabsPanel>
              <TabsPanel ml="xl" value="element-tab">
                <ElementParamsPage />
              </TabsPanel>
              <TabsPanel ml="xl" value="type-filters-tab">
                <TypeFilterParamsPage />
              </TabsPanel>
            </Tabs>
          </Container>
        </Card>
      )}
      <Card>
        <Container fluid m="xl">
          <Flex align="center" mb="lg">
            <Title mr="sm">Organize Output By Patient</Title>
            <Tooltip
              position="right"
              withArrow
              transitionProps={{ duration: 200 }}
              label="Set organizeOutputBy to Patient"
            >
              <IconInfoCircle color="gray" />
            </Tooltip>
          </Flex>
          <OrganizeOutputByPatientSwitch />
        </Container>
      </Card>
    </>
  );
}
