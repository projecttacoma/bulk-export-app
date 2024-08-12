import {
  Modal,
  Mark,
  Divider,
  Card,
  MultiSelect,
  Stack,
  Title,
  Button,
  ScrollAreaAutosize,
  Group
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useState } from 'react';
import React from 'react';
import { useRecoilState } from 'recoil';
import { TypeFilterData, TypeFilterParamInput } from './type-filter-param-input';
import { typeFilterParamsState } from '@/state/type-filter-params-state';
import { searchParameters } from 'fhir-spec-tools/build/data/searchParameters';
import classes from '@/app/global.module.css';

export interface TypeFilterModalProps {
  resourceType: string;
  closeModal: () => void;
  editingTypeFilter?: string;
}
/*
 * Component for selecting type filters and entering values
 */
export default function TypeFilterModal({ resourceType, closeModal, editingTypeFilter }: TypeFilterModalProps) {
  const [stagedTypeFilters, setStagedTypeFilters] = useState<Record<string, string>>({});

  const prevTypeFilter = editingTypeFilter ? createPreviouslyCreatedFilter(resourceType, editingTypeFilter) : undefined;

  const [activeElements, setActiveElements] = useState<string[]>(prevTypeFilter?.elements ?? []);
  const [createdTypeParams, setCreatedTypeParams] = useState<TypeFilterData[]>(prevTypeFilter?.typeFilters ?? []);

  const [typeFilters, setTypeFilters] = useRecoilState(typeFilterParamsState);

  const createTypeFilter = (element: string, val: string) =>
    setStagedTypeFilters(prev => ({ ...prev, [element]: val }));

  const handleConfirm = () => {
    const stagedFilterValues = Object.values(stagedTypeFilters).filter(filter => filter !== '');
    const combinedTypeFilter = `${resourceType}?${stagedFilterValues.join('&')}`;
    const noValues = stagedFilterValues.join() === '';

    if (noValues) {
      notifications.show({
        title: 'Type filter not created',
        color: 'red',
        message: 'Type filter was not created because there were no values specified.'
      });
      return;
    }

    setTypeFilters(prev => [
      ...prev.filter(tyf => tyf.filter !== editingTypeFilter),
      { filter: combinedTypeFilter, active: true }
    ]);

    editingTypeFilter
      ? notifications.show({
          title: 'Updated type filter',
          message: combinedTypeFilter
        })
      : notifications.show({
          title: 'Created type filter',
          message: combinedTypeFilter
        });
  };

  const resourceSearchParams = searchParameters[resourceType];
  if (!resourceSearchParams) {
    notifications.show({
      title: 'Cannot Edit this Type Filter',
      message: `Type filter: ${editingTypeFilter} is incorrectly formatted`,
      color: 'red'
    });
    closeModal();
    return;
  }
  return (
    <>
      <Modal.Header>
        <Modal.Title fz={'h2'} fw={700}>
          {editingTypeFilter ? 'Edit' : 'Create'} Type Filter on{' '}
          <Mark className={classes.blueText}>{resourceType}</Mark> Resource
        </Modal.Title>
        <Modal.CloseButton />
      </Modal.Header>
      <Divider />
      <Modal.Body bg="gray.0" p="xl">
        <Stack>
          <Card>
            <MultiSelect
              label="Select Elements"
              description="Select elements to add type filters"
              placeholder="Search for elements"
              nothingFoundMessage="No elements matching search found."
              hidePickedOptions
              value={activeElements}
              data={Object.keys(resourceSearchParams)}
              onChange={setActiveElements}
              onOptionSubmit={element =>
                setCreatedTypeParams([...createdTypeParams, { type: resourceType, element: element } as TypeFilterData])
              }
              onClear={() => {
                setStagedTypeFilters({});
                setCreatedTypeParams([]);
              }}
              onRemove={element => {
                setStagedTypeFilters(prev => {
                  delete prev[element];
                  return prev;
                });
                setCreatedTypeParams(createdTypeParams.filter(filter => filter.element !== element));
              }}
            />
          </Card>
          {createdTypeParams.length !== 0 && (
            <Card>
              <Stack>
                <Title order={3}>Input Filter Values</Title>
                <ScrollAreaAutosize mah={400} mx="auto" scrollbars="y" pl="lg" pr="lg" w="100%">
                  {createdTypeParams.map((filter, key) => (
                    <TypeFilterParamInput
                      key={key}
                      type={filter.type}
                      element={filter.element}
                      createFilter={createTypeFilter}
                      date={filter.date}
                      value={filter.value}
                      comparator={filter.comparator}
                    />
                  ))}
                </ScrollAreaAutosize>
              </Stack>
            </Card>
          )}
          <Group grow>
            <Button
              size="lg"
              radius="md"
              onClick={() => {
                handleConfirm();
                closeModal();
              }}
              disabled={createdTypeParams.length === 0}
            >
              Confirm
            </Button>
            {editingTypeFilter && (
              <Button
                size="lg"
                radius="md"
                color="red"
                onClick={() => {
                  setTypeFilters(typeFilters.filter(tyf => tyf.filter !== editingTypeFilter));
                  notifications.show({
                    title: 'Deleted type filter',
                    message: editingTypeFilter
                  });
                  closeModal();
                }}
              >
                Delete
              </Button>
            )}
          </Group>
        </Stack>
      </Modal.Body>
    </>
  );
}

function createPreviouslyCreatedFilter(type: string, typeFilter: string) {
  const pattern = /[?&]([^=]+)=([^&]+)/g;
  const queryParams: Record<string, string> = {};
  let match;
  while ((match = pattern.exec(typeFilter)) !== null) {
    queryParams[match[1]] = match[2];
  }

  const elements = Object.keys(queryParams);

  const typeFilters = elements.map(
    element =>
      ({
        type: type,
        element: element,
        value: queryParams[element],
        date: new Date(queryParams[element].substring(2)),
        comparator: queryParams[element].substring(0, 2)
      }) as TypeFilterData
  );

  return { typeFilters, elements };
}
