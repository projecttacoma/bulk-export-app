'use client';

import { activeTypeFilterParamsState } from '@/state/type-filter-params-state';
import { ActionIcon, Button, Card, Divider, Grid, GridCol, Group, Input, Mark, Stack, Title } from '@mantine/core';
import { useState } from 'react';
import { useRecoilState } from 'recoil';
import classes from '@/app/global.module.css';
import { IconBackspace } from '@tabler/icons-react';

/*
 * Component that displays input to create type filters, and shows active type filters.
 */

export default function TypeFilterParamsPage() {
  const [typeFilters, setTypeFilters] = useRecoilState(activeTypeFilterParamsState);
  const [inputValue, setInputValue] = useState('');

  const addTypeFilter = () => {
    const encodedFilter = encodeURIComponent(inputValue);

    if (typeFilters.some(ty => ty === encodedFilter)) return;

    setTypeFilters([...typeFilters, encodedFilter]);
  };

  const removeTypeFilter = (filter: string) => {
    setTypeFilters(typeFilters.filter(val => val !== filter));
  };

  const removeAllTypeFilters = () => setTypeFilters([]);

  return (
    <Grid gutter="xl">
      <GridCol span="auto">
        <Stack gap="lg">
          <Title order={2}>Type Filter Parameter Selection</Title>
          <Input
            placeholder="Input type filter"
            value={inputValue}
            onChange={event => setInputValue(event.currentTarget.value)}
            rightSectionPointerEvents="all"
            mt="md"
          />
          <Group>
            <Button onClick={addTypeFilter} disabled={inputValue.trim() === ''}>
              Add Filter
            </Button>
            <Button color="red" onClick={removeAllTypeFilters}>
              Remove All Filters
            </Button>
          </Group>
        </Stack>
      </GridCol>
      <GridCol span={{ base: 12, xl: 7 }}>
        <Stack gap="sm">
          <Title order={3}>Active Type Filters</Title>
          <Divider />
          {typeFilters.map(typeFilter => (
            <Card
              padding="xs"
              shadow="none"
              key={typeFilter}
              withBorder
              onClick={() => setInputValue(decodeURIComponent(typeFilter))}
            >
              <Group justify="space-between">
                <Group gap="xl" justify="flex-end" align="flex-end">
                  <TypeFilterText typeFilter={typeFilter} />
                </Group>
                <ActionIcon
                  variant="transparent"
                  color="dark"
                  value={typeFilter}
                  onClick={event => removeTypeFilter(event.currentTarget.value)}
                >
                  <IconBackspace />
                </ActionIcon>
              </Group>
            </Card>
          ))}
          {typeFilters.length === 0 && <>No type filters yet</>}
        </Stack>
      </GridCol>
    </Grid>
  );
}

/*
 * Component to display type filter text in a readable way
 */
function TypeFilterText({ typeFilter }: { typeFilter: string }) {
  const decoded = decodeURIComponent(typeFilter);
  const decodedAndSplit = decoded.split('?');

  if (decodedAndSplit.length !== 2) {
    return <Title order={4}>{decoded}</Title>;
  }

  return (
    <Title order={4}>
      <Mark className={classes.blueText}>{decodedAndSplit[0]}</Mark>?{decodedAndSplit[1]}
    </Title>
  );
}
