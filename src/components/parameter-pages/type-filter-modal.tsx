import classes from '@/app/global.module.css';
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
import { useState } from 'react';
import { activeTypeFilterParamsState } from '@/state/type-filter-params-state';
import { useRecoilState } from 'recoil';
import { parsedPropertyPaths } from 'fhir-spec-tools/build/data/propertyPaths';
import { notifications } from '@mantine/notifications';
import { TypeFilterParam } from './type-filter-parameter-classes';
import React from 'react';

export interface TypeFilterModalProps {
  resourceType: string;
  closeModal: () => void;
  editingTypeFilter?: string;
}
export default function TypeFilterModal({ resourceType, closeModal, editingTypeFilter }: TypeFilterModalProps) {
  const [activeElements, setActiveElements] = useState<string[]>(
    editingTypeFilter ? createPreviouslyCreatedFilters(resourceType, editingTypeFilter).elementsWithTypeFilters : []
  );
  const [createdTypeParams, setCreatedTypeParams] = useState<TypeFilterParam[]>(
    editingTypeFilter ? createPreviouslyCreatedFilters(resourceType, editingTypeFilter).previouslyCreatedParameters : []
  );
  const [typeFilters, setTypeFilters] = useRecoilState(activeTypeFilterParamsState);

  const createTypeFilter = () => {
    const elementFilters = createdTypeParams.map(filter => filter.toTypeFilterString());
    const nonEmptyElementFilters = elementFilters.filter(ty => ty !== '');

    if (nonEmptyElementFilters.length === 0) {
      notifications.show({
        title: 'Type filter not created',
        color: 'red',
        message: 'Type filter was not created because there were no values specified.'
      });
      return;
    }

    const filter = `${resourceType}?${nonEmptyElementFilters.join('&')}`;

    setTypeFilters([...typeFilters.filter(tyf => tyf.filter !== editingTypeFilter), { filter: filter, active: true }]);
    if (editingTypeFilter)
      notifications.show({
        title: 'Update type filer',
        message: filter
      });
    else
      notifications.show({
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
              data={parsedPropertyPaths[resourceType]}
              onChange={setActiveElements}
              onOptionSubmit={element =>
                setCreatedTypeParams([...createdTypeParams, TypeFilterParam.createParameter(resourceType, element)])
              }
              onClear={() => setCreatedTypeParams([])}
              onRemove={value => setCreatedTypeParams(createdTypeParams.filter(filter => filter.elementName !== value))}
            />
          </Card>
          {createdTypeParams.length !== 0 && (
            <Card>
              <Stack>
                <Title order={3}>Input Filter Values</Title>
                <ScrollAreaAutosize mah={400} mx="auto" scrollbars="y" pl="lg" pr="lg" w="100%">
                  {createdTypeParams.map((filter, key) => (
                    <React.Fragment key={`${filter}:${key}`}>{filter.render()}</React.Fragment>
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
                createTypeFilter();
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

function createPreviouslyCreatedFilters(type: string, typeFilter: string) {
  const pattern = /[?&]([^=]+)=([^&]+)/g;
  const queryParams: Record<string, string> = {};
  let match;
  while ((match = pattern.exec(typeFilter)) !== null) {
    queryParams[match[1]] = match[2];
  }

  const elementsWithTypeFilters = Object.keys(queryParams);

  const previouslyCreatedParameters = elementsWithTypeFilters.map(element =>
    TypeFilterParam.createParameter(
      type,
      element,
      queryParams[element],
      new Date(queryParams[element].substring(2)),
      queryParams[element].substring(0, 2)
    )
  );

  return { previouslyCreatedParameters, elementsWithTypeFilters };
}
