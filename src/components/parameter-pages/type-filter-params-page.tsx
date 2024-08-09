'use client';

import { Button, Divider, Grid, GridCol, Group, Modal, Select, Stack, TextInput, Title } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useDisclosure } from '@mantine/hooks';
import { ReactNode, useState } from 'react';
import { useRecoilState } from 'recoil';
import { TypeFilter, typeFilterParamsState } from '@/state/type-filter-params-state';
import { resourceTypesDropdownData } from '@/util/multiselectUtil';
import TypeFilterModal from './type-filter-modal';
import TypeFilterTable from './type-filter-table';
import classes from '@/app/global.module.css';

/*
 * Component that displays input to create type filters, and shows active type filters.
 */
export default function TypeFilterParamsPage() {
  const [filterInputValue, setFilterInputValue] = useState('');
  const [activeTypeFilters, setActiveTypeFilters] = useRecoilState(typeFilterParamsState);
  const [opened, { open, close }] = useDisclosure(false);
  const [modalContent, setModalContent] = useState<ReactNode>();

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

  const handleSubmitValue = (value: string) => {
    setModalContent(<TypeFilterModal resourceType={value} closeModal={close} />);
    open();
  };
  return (
    <Grid gutter="lg">
      <GridCol span={12}>
        <Title order={2}>Type Filter Parameter Selection</Title>
      </GridCol>
      <GridCol span="auto">
        <Stack gap="lg">
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
          <Group grow>
            <Select
              label="Select Type Filters"
              placeholder="Search for types"
              nothingFoundMessage="No types matching search found."
              description="Add type filters to selected type"
              data={resourceTypesDropdownData}
              value=""
              className={classes.MultiSelectStyles}
              onOptionSubmit={handleSubmitValue}
              onClear={() => setActiveTypeFilters([])}
            />
          </Group>
        </Stack>
      </GridCol>
      <GridCol span={{ base: 12, xl: 8 }}>
        <Stack gap="sm">
          <Title order={3}>Active Type Filters</Title>
          <Divider />
          <TypeFilterTable
            setFilterInput={setFilterInputValue}
            setModalContext={setModalContent}
            closeModal={close}
            openModal={open}
          />
        </Stack>
      </GridCol>
      <Modal.Root opened={opened} onClose={close} size="75%" radius="md">
        <Modal.Overlay />
        <Modal.Content>{modalContent}</Modal.Content>
      </Modal.Root>
    </Grid>
  );
}
