'use client';

import { activeTypeFilterParamsState } from '@/state/type-filter-params-state';
import {
  ActionIcon,
  Button,
  Card,
  Divider,
  Grid,
  GridCol,
  Group,
  Mark,
  Stack,
  TextInput,
  Title,
  Tooltip
} from '@mantine/core';
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
    const duplicateFilter = typeFilters.some(ty => ty === encodedFilter);

    if (duplicateFilter) return;

    setTypeFilters([...typeFilters, encodedFilter]);
  };

  const removeTypeFilter = (filter: string) => setTypeFilters(typeFilters.filter(val => val !== filter));

  const removeAllTypeFilters = () => setTypeFilters([]);

  return (
    <Grid gutter="xl">
      <GridCol span="auto">
        <Stack gap="lg">
          <Title order={2}>Type Filter Parameter Selection</Title>
          <TextInput
            label="Write type filters"
            description="Use this input to manually create type filters. Multiple filters are combined as 'OR' expressions"
            placeholder="Input type filter"
            className={classes.MultiSelectStyles}
            size="md"
            radius="md"
            value={inputValue}
            onChange={event => setInputValue(event.currentTarget.value)}
          />
          <Group justify="center" className={classes.MultiSelectStyles}>
            <Button onClick={addTypeFilter} disabled={inputValue.trim() === ''}>
              Add Filter
            </Button>
            <Button color="red" onClick={removeAllTypeFilters}>
              Remove All Filters
            </Button>
          </Group>
        </Stack>
      </GridCol>
      <GridCol span={{ base: 12, xl: 6 }}>
        <Stack gap="sm">
          <Title order={3}>Active Type Filters</Title>
          <Divider />
          {typeFilters.map(typeFilter => (
            <Tooltip openDelay={1000} label={'Click to add new filter based on this one'} position="top-start">
              <Card
                style={{ cursor: 'pointer' }}
                padding="xs"
                shadow="none"
                key={typeFilter}
                withBorder
                onClick={() => setInputValue(decodeURIComponent(typeFilter))}
              >
                <Group justify="space-between">
                  <TypeFilterText typeFilter={typeFilter} />
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
            </Tooltip>
          ))}
          {typeFilters.length === 0 && <>No type filters set</>}
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
    return <Title order={5}>{decoded}</Title>;
  }

  return (
    <Title order={5}>
      <Mark className={classes.blueText}>{decodedAndSplit[0]}</Mark>?{decodedAndSplit[1]}
    </Title>
  );
}
