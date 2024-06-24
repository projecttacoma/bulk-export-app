import { Center, Container, Paper, rem, Tabs, TabsList, TabsPanel, TabsTab, Title, Tooltip } from '@mantine/core';
import { Suspense } from 'react';
import classes from './page.module.css';
import QueryString from '@/components/query-string';
import TypeParamsPage from '@/components/type-page/type-params-page';
import { IconInfoCircle } from '@tabler/icons-react';

const parametersHelpText = 'Add parameters to your bulk export query';

export default function QueryBuilder() {
  return (
    <>
      <Center className={classes.main}>
        <Suspense fallback={<>Loading Query String</>}>
          <QueryString />
        </Suspense>
      </Center>
      <Paper shadow="md" radius="lg" p="sm" withBorder>
        <Container fluid className={classes.tabContainer} h={rem(450)}>
          <Title className={classes.selectorTitle}>Parameters</Title>
          <Tooltip
            position="right"
            withArrow
            transitionProps={{ duration: 200 }}
            zIndex={400}
            label={parametersHelpText}
          >
            <IconInfoCircle color="gray" />
          </Tooltip>
          <Tabs defaultValue="type-tab" classNames={classes} orientation="vertical" radius="md">
            <TabsList>
              <TabsTab value="type-tab">Types</TabsTab>
              <TabsTab value="element-tab">Elements</TabsTab>
              <TabsTab value="type-filters-tab">Type Filters</TabsTab>
            </TabsList>
            <TabsPanel value="type-tab">
              <TypeParamsPage />
            </TabsPanel>
            <TabsPanel value="element-tab">Element Tab coming soon...</TabsPanel>
            <TabsPanel value="type-filters-tab">Type Filters Tab coming soon...</TabsPanel>
          </Tabs>
        </Container>
      </Paper>
    </>
  );
}
