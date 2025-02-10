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
  Text,
  Title,
  Tooltip
} from '@mantine/core';
import { Dropzone } from '@mantine/dropzone';
import QueryString from '@/components/query-string';
import TypeParamsPage from '@/components/parameter-pages/type-params-page';
import { IconAlertCircle, IconCircleCheck, IconFileCheck, IconFileImport, IconInfoCircle } from '@tabler/icons-react';
import { SupportedExportTypes } from '@/components/query-selector/export-type';
import { Suspense, useState } from 'react';
import ElementParamsPage from '@/components/parameter-pages/elements-params-page';
import TypeFilterParamsPage from '@/components/parameter-pages/type-filter-params-page';
import OrganizeOutputByPatientSwitch from '@/components/parameter-pages/organize-output-by-swtich';
import { showNotification } from '@mantine/notifications';
import { useRecoilState, useRecoilValue } from 'recoil';
import { measureBundleState } from '@/state/measure-bundle';
import { useSearchParams } from 'next/navigation';
import { CodeHighlight } from '@mantine/code-highlight';
import { group } from 'fqm-bulk-utils';
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
  const [measureBundle, setMeasureBundle] = useRecoilState(measureBundleState);
  const [groupText, setGroupText] = useState('No measure bundle content'); //TODO: probably change to selector?
  const bulkExportBaseURL = useRecoilValue(bulkServerURLState);
  const [groupId, setGroupId] = useState(null); //TODO: maybe use recoil?

  const rejectUpload = (message: string) => {
    showNotification({
      icon: <IconAlertCircle />,
      title: 'Bundle upload failed',
      message: `There was an issue uploading your bundle: ${message}`,
      color: 'red'
    });
  };

  const createGroup = () => {
    fetch(`${bulkExportBaseURL}/Group`, {
      method: 'POST',
      body: groupText,
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
          title: 'Group creation failed',
          message: `Group creation failed with error: ${err}`,
          color: 'red'
        });
      });
  };

  const extractMeasureBundle = (file: File) => {
    const reader = new FileReader();
    reader.onload = async () => {
      const bundle = JSON.parse(reader.result as string) as fhir4.Bundle;
      const measures = bundle.entry?.filter(r => r?.resource?.resourceType === 'Measure');
      if (bundle.resourceType !== 'Bundle') {
        rejectUpload("Uploaded file must be a JSON FHIR Resource of type 'Bundle'");
        return;
      } else if (!measures || measures.length !== 1) {
        rejectUpload("Uploaded bundle must contain exactly one resource of type 'Measure'");
        return;
      }

      setMeasureBundle(mb => ({
        ...mb,
        fileName: file.name,
        content: bundle,
        isFile: true,
        selectedMeasureId: null,
        displayMap: {}
      }));

      showNotification({
        icon: <IconCircleCheck />,
        title: 'Upload Success',
        message: `Successfully uploaded ${file.name}`,
        color: 'green'
      });

      try {
        const text = JSON.stringify(await group(bundle), null, 2);
        setGroupText(text);
      } catch (err) {
        console.error(err);
        showNotification({
          icon: <IconAlertCircle />,
          title: 'Group calculation failed',
          message: `Calculation failed with error: ${err}`,
          color: 'red'
        });
      }
    };
    reader.readAsText(file);
  };

  return (
    <>
      <Center mt="xl">
        <Suspense>
          <QueryString />
        </Suspense>
      </Center>
      {searchParams.get('exportType') === 'measure' ? (
        <Card>
          <Dropzone
            onDrop={files => extractMeasureBundle(files[0])}
            onReject={files =>
              showNotification({
                id: 'failed-upload',
                icon: <IconAlertCircle />,
                title: 'File upload failed',
                message: `Could not upload file: ${files[0].file.name}. ${files[0].errors[0].message}`,
                color: 'red'
              })
            }
            accept={['application/json']}
            multiple={false}
            p={36}
          >
            <Center>
              {measureBundle.fileName && measureBundle.isFile ? (
                <IconFileCheck size={48} color="green" />
              ) : (
                <IconFileImport size={48} />
              )}
              <Text
                size="lg"
                inline
                style={{ color: measureBundle.fileName && measureBundle.isFile ? 'green' : 'black' }}
              >
                {measureBundle.fileName && measureBundle.isFile
                  ? measureBundle.fileName
                  : 'Drag a Measure Bundle JSON file here or click to select file'}
              </Text>
            </Center>
          </Dropzone>
          <ScrollArea.Autosize mah={600} mx="auto" scrollbars="y" bd="1px solid gray.2" mr="lg" ml="lg">
            <CodeHighlight withCopyButton={true} code={groupText} language="json" />
          </ScrollArea.Autosize>
          {groupId ? (
            <Link href={`/query-builder?exportType=group&id=${groupId}`}>
              <Button disabled={!groupId}>Group Export</Button>
            </Link>
          ) : (
            <Button disabled={groupText === 'No measure bundle content'} onClick={createGroup}>
              Create
            </Button>
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
