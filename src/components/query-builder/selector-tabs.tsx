'use client';
import { Tabs } from '@mantine/core';
import TypePage from './type-page';
import ElementPage from './element-page';
import TypeFiltersPage from './type-filters-page';
import { useState } from 'react';

export default function SelectorTabs() {
  const [activeTab, setActiveTab] = useState<string | null>('type-tab');
  return (
    <Tabs value={activeTab} onChange={setActiveTab} defaultValue="type-tab">
      <Tabs.List grow justify="center">
        <Tabs.Tab value="type-tab">Type</Tabs.Tab>
        <Tabs.Tab value="element-tab">Element</Tabs.Tab>
        <Tabs.Tab value="type-filters-tab">Type Filters</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="type-tab">
        <TypePage />
      </Tabs.Panel>
      <Tabs.Panel value="element-tab">
        <ElementPage />
      </Tabs.Panel>
      <Tabs.Panel value="type-filters-tab">
        <TypeFiltersPage />
      </Tabs.Panel>
    </Tabs>
  );
}
