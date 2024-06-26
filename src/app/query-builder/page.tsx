import { Center, Container, Flex, Paper, Tabs, TabsList, TabsPanel, TabsTab, Title, Tooltip } from '@mantine/core';
import QueryString from '@/components/query-string';
import TypeParamsPage from '@/components/type-page/type-params-page';
import { IconInfoCircle } from '@tabler/icons-react';
import { SupportedExportTypes } from '@/components/query-selector/export-type';

/*
 * Properties of the query string that can be passed to this page
 */
export interface SearchParamsProps {
  exportType: SupportedExportTypes;
  id?: string;
}

export default function QueryBuilder({ searchParams }: { searchParams: SearchParamsProps }) {
  return (
    <>
      <Center mt="xl">
        <QueryString searchParams={searchParams} />
      </Center>
      <Paper shadow="md" radius="lg" p="sm">
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
              Element Tab coming soon...
            </TabsPanel>
            <TabsPanel ml="xl" value="type-filters-tab">
              Type Filters Tab coming soon...
            </TabsPanel>
          </Tabs>
        </Container>
      </Paper>
    </>
  );
}
