import { Modal, Card, MultiSelect, Stack, Title, Button, ScrollAreaAutosize, Group } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useState } from 'react';
import React from 'react';
import { useRecoilState } from 'recoil';
import { TypeFilterData, TypeFilterParamInput } from './type-filter-param-input';
import { typeFilterParamsState } from '@/state/type-filter-params-state';
import { searchParameters } from 'fhir-spec-tools/build/data/searchParameters';
import { modals } from '@mantine/modals';

export interface TypeFilterModalProps {
  resourceType: string;
  editingTypeFilter?: string;
}

/*
 * Component for selecting type filters and entering values
 */
export default function TypeFilterModal({ resourceType, editingTypeFilter }: TypeFilterModalProps) {
  const prevTypeFilter = editingTypeFilter ? createPreviouslyCreatedFilter(resourceType, editingTypeFilter) : undefined;

  const [activeElements, setActiveElements] = useState<string[]>(prevTypeFilter?.elements ?? []);
  const [stagedFilters, setStagedFilters] = useState<Record<string, string>>(prevTypeFilter?.prevFilterValues ?? {});
  const [createdTypeParams, setCreatedTypeParams] = useState<TypeFilterData[]>(prevTypeFilter?.filterParams ?? []);

  const [typeFilters, setTypeFilters] = useRecoilState(typeFilterParamsState);

  const addFilter = (element: string, filterVal: string) =>
    setStagedFilters(prev => ({ ...prev, [element]: filterVal }));

  const handleConfirm = () => {
    const filters = Object.entries(stagedFilters).map(elemVal => `${elemVal[0]}=${elemVal[1]}`);
    const typeFilter = `${resourceType}?${filters.join('&')}`;

    if (filters.length === 0) {
      notifications.show({
        title: 'Type filter not created',
        color: 'red',
        message: 'Type filter was not created because there were no values specified.'
      });
      return;
    }

    setTypeFilters(prev => [
      ...prev.filter(tyf => tyf.filter !== editingTypeFilter),
      { filter: typeFilter, active: true }
    ]);

    editingTypeFilter
      ? notifications.show({
          title: 'Updated type filter',
          message: typeFilter
        })
      : notifications.show({
          title: 'Created type filter',
          message: typeFilter
        });
  };

  const resourceSearchParams = searchParameters[resourceType];
  if (!resourceSearchParams) {
    notifications.show({
      title: 'Cannot edit this type filter',
      message: `Type filter: ${editingTypeFilter} is incorrectly formatted`,
      color: 'red'
    });
    modals.closeAll();
    return;
  }
  return (
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
              setStagedFilters({});
              setCreatedTypeParams([]);
            }}
            onRemove={element => {
              setStagedFilters(prev => {
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
                    value={filter.value}
                    addFilter={addFilter}
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
              modals.closeAll();
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
                modals.closeAll();
              }}
            >
              Delete
            </Button>
          )}
        </Group>
      </Stack>
    </Modal.Body>
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

  const filterParams = elements.map(
    element =>
      ({
        type: type,
        element: element,
        value: queryParams[element]
      }) as TypeFilterData
  );

  const prevFilterValues: Record<string, string> = {};
  elements.forEach(e => (prevFilterValues[e] = queryParams[e]));

  return { filterParams, elements, prevFilterValues };
}
