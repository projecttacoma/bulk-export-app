import { Button, Center, InputWrapper, Tabs, TabsList, TabsPanel, TabsTab } from '@mantine/core';
import { Suspense } from 'react';
import classes from './page.module.css';
import QueryString from '@/components/query-string';
import TypeParamsPage from '@/components/type-page/type-params-page';

export default function QueryBuilder() {
  return (
    <>
      <Center className={classes.main}>
        <InputWrapper
          label="Query String"
          description="This is your generated query string. You can also paste or write your own here."
          size="xl"
        >
          <Suspense fallback={<>Loading String</>}>
            <QueryString />
          </Suspense>
        </InputWrapper>
        <Button>Run Query</Button>
      </Center>
      <Tabs defaultValue="type-tab">
        <TabsList grow justify="center">
          <TabsTab value="type-tab">Type</TabsTab>
          <TabsTab value="element-tab">Element</TabsTab>
          <TabsTab value="type-filters-tab">Type Filters</TabsTab>
        </TabsList>
        <TabsPanel value="type-tab">
          <TypeParamsPage />
        </TabsPanel>
        <TabsPanel value="element-tab">no content</TabsPanel>
        <TabsPanel value="type-filters-tab">no content</TabsPanel>
      </Tabs>
    </>
  );
}
