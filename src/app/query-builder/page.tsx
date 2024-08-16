import { Card, Center, Container, Flex, Tabs, TabsList, TabsPanel, TabsTab, Title, Tooltip } from '@mantine/core';
import QueryString from '@/components/query-string';
import TypeParamsPage from '@/components/parameter-pages/type-params-page';
import { IconInfoCircle } from '@tabler/icons-react';
import { SupportedExportTypes } from '../page';
import { Suspense } from 'react';
import ElementParamsPage from '@/components/parameter-pages/elements-params-page';
import TypeFilterParamsPage from '@/components/parameter-pages/type-filter-params-page';

/*
 * Properties of the query string that can be passed to this page
 */
export interface SearchParamsProps {
  exportType: SupportedExportTypes;
  id?: string;
}

export default function QueryBuilder() {
  return (
    <>
      <Center mt="xl">
        <Suspense>
          <QueryString />
        </Suspense>
      </Center>
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
    </>
  );
}
