import { Center, Tabs, TabsList, TabsPanel, TabsTab } from '@mantine/core';
import { Suspense } from 'react';
import classes from './page.module.css';
import QueryString from '@/components/query-string';
import TypeParamsPage from '@/components/type-page/type-params-page';

export default function QueryBuilder() {
  return (
    <>
      <Center className={classes.main}>
        <Suspense fallback={<>Loading Query String</>}>
          <QueryString />
        </Suspense>
      </Center>
      <Tabs defaultValue="type-tab" classNames={classes}>
        <TabsList grow justify="center">
          <TabsTab value="type-tab">Type</TabsTab>
          <TabsTab value="element-tab">Element</TabsTab>
          <TabsTab value="type-filters-tab">Type Filters</TabsTab>
        </TabsList>
        <TabsPanel value="type-tab">
          <TypeParamsPage />
        </TabsPanel>
        <TabsPanel value="element-tab">Element Tab</TabsPanel>
        <TabsPanel value="type-filters-tab">Type Filters Tab</TabsPanel>
      </Tabs>
    </>
  );
}
