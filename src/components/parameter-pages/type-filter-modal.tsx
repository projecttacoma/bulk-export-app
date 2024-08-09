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
import { ReactElement, useState } from 'react';
import React from 'react';
import { useRecoilState } from 'recoil';
import { TypeFilterParamInput } from './type-filter-param-input';
import { typeFilterParamsState } from '@/state/type-filter-params-state';
import { SearchParameters } from '../../../data/searchParameters';
import classes from '@/app/global.module.css';

export interface TypeFilterModalProps {
  resourceType: string;
  closeModal: () => void;
  editingTypeFilter?: string;
}
export default function TypeFilterModal({ resourceType, closeModal, editingTypeFilter }: TypeFilterModalProps) {
  const [stagedTypeFilters, setStagedTypeFilters] = useState<Record<string, string>>({});

  const createTypeFilter = (element: string, val: string) =>
    setStagedTypeFilters(prev => ({ ...prev, [element]: val }));

  const prevTypeFilter = editingTypeFilter
    ? createPreviouslyCreatedFilters(resourceType, editingTypeFilter, createTypeFilter)
    : undefined;

  const [activeElements, setActiveElements] = useState<string[]>(prevTypeFilter?.elements ?? []);
  const [createdTypeParams, setCreatedTypeParams] = useState<ReactElement[]>(prevTypeFilter?.typeFilters ?? []);

  const [typeFilters, setTypeFilters] = useRecoilState(typeFilterParamsState);

  const handleConfirm = () => {
    const staged = Object.values(stagedTypeFilters).filter(filter => filter !== '');
    const filter = `${resourceType}?${staged.join('&')}`;
    const noValues = staged.join() === '';

    if (noValues) {
      notifications.show({
        title: 'Type filter not created',
        color: 'red',
        message: 'Type filter was not created because there were no values specified.'
      });
      return;
    }
    setTypeFilters(prev => [...prev.filter(tyf => tyf.filter !== editingTypeFilter), { filter: filter, active: true }]);

    editingTypeFilter
      ? notifications.show({
          title: 'Updated type filter',
          message: filter
        })
      : notifications.show({
          title: 'Created type filter',
          message: filter
        });
  };

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
              data={Object.keys(SearchParameters[resourceType])}
              onChange={setActiveElements}
              onOptionSubmit={element =>
                setCreatedTypeParams([
                  ...createdTypeParams,
                  <TypeFilterParamInput createFilter={createTypeFilter} type={resourceType} element={element} />
                ])
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
                setCreatedTypeParams(createdTypeParams.filter(filter => filter.props.element !== element));
              }}
            />
          </Card>
          {createdTypeParams.length !== 0 && (
            <Card>
              <Stack>
                <Title order={3}>Input Filter Values</Title>
                <ScrollAreaAutosize mah={400} mx="auto" scrollbars="y" pl="lg" pr="lg" w="100%">
                  {createdTypeParams.map((Filter, key) => (
                    <React.Fragment key={`${key}`}>{Filter}</React.Fragment>
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

function createPreviouslyCreatedFilters(
  type: string,
  typeFilter: string,
  createFilter: (element: string, filter: string) => void
) {
  const pattern = /[?&]([^=]+)=([^&]+)/g;
  const queryParams: Record<string, string> = {};
  let match;
  while ((match = pattern.exec(typeFilter)) !== null) {
    queryParams[match[1]] = match[2];
  }

  const elements = Object.keys(queryParams);

  const typeFilters = elements.map(element => (
    <TypeFilterParamInput
      createFilter={createFilter}
      type={type}
      element={element}
      value={queryParams[element]}
      date={new Date(queryParams[element].substring(2))}
      comparator={queryParams[element].substring(0, 2)}
    />
  ));

  return { typeFilters, elements };
}
