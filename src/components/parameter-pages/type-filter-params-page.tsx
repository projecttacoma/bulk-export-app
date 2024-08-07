'use client';

import { Button, Divider, Grid, GridCol, Group, Stack, TextInput, Title } from '@mantine/core';
import { useState } from 'react';
import classes from '@/app/global.module.css';
import TypeFilterTable from './type-filter-table';
import { notifications } from '@mantine/notifications';
import { useRecoilState } from 'recoil';
import { typeFilterParamsState, TypeFilter } from '@/state/type-filter-params-state';

/*
 * Component that displays input to create type filters, and shows active type filters.
 */
export default function TypeFilterParamsPage() {
  const [filterInputValue, setFilterInputValue] = useState('');
  const [activeTypeFilters, setActiveTypeFilters] = useRecoilState(typeFilterParamsState);

  const sortTypeFilters = (arr: TypeFilter[]) => arr.sort((a, b) => (a.filter[0] < b.filter[0] ? -1 : 1));

  const addTypeFilter = () => {
    const duplicateFilter = activeTypeFilters.some(ty => ty.filter === filterInputValue);

    if (duplicateFilter) {
      notifications.show({
        title: 'Filter already added',
        message: `This filter has already been added.`
      });
      return;
    }
    setActiveTypeFilters(prev => sortTypeFilters([...prev, { filter: filterInputValue, active: true } as TypeFilter]));
  };

  return (
    <Grid gutter="xl">
      <GridCol span="auto">
        <Stack gap="lg">
          <Title order={2}>Type Filter Parameter Selection</Title>
          <TextInput
            label="Write type filters"
            description="Use this input to manually create type filters"
            placeholder="Input type filter"
            className={classes.MultiSelectStyles}
            size="md"
            radius="md"
            value={filterInputValue}
            onChange={event => setFilterInputValue(event.currentTarget.value)}
            rightSectionWidth={105}
            rightSection={
              <Button onClick={addTypeFilter} disabled={filterInputValue.trim() === ''} radius="md" mr={2}>
                Add Filter
              </Button>
            }
          />
        </Stack>
      </GridCol>
      <GridCol span={{ base: 12, xl: 7 }}>
        <Stack gap="sm">
          <Group justify="space-between">
            <Title order={3}> Type Filters</Title>
          </Group>
          <Divider />
          <TypeFilterTable setFilterInput={setFilterInputValue} />
        </Stack>
      </GridCol>
    </Grid>
  );
}
