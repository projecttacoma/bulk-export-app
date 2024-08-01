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
import { useMemo, useState } from 'react';
import { PrimaryDatePaths } from 'fhir-spec-tools';
import { activeTypeFilterParamsState } from '@/state/type-filter-params-state';
import { useRecoilState } from 'recoil';
import { parsedPropertyPaths } from 'fhir-spec-tools/build/data/propertyPaths';
import { notifications } from '@mantine/notifications';
import { DateTimeParam, OtherParam, TypeFilterParam } from './type-filter-parameter-classes';
import React from 'react';

export interface TypeFilterModalProps {
  resourceType: string;
  closeModal: () => void;
  editingTypeFilter?: string;
}
export default function TypeFilterModal({ resourceType, closeModal, editingTypeFilter }: TypeFilterModalProps) {
  const [activeElements, setActiveElements] = useState<string[]>(
    editingTypeFilter ? getPreviouslyCreatedElements(editingTypeFilter).elements : []
  );
  const [createdTypeParams, setCreatedTypeParams] = useState<TypeFilterParam[]>(
    editingTypeFilter ? getPreviouslyCreatedElements(editingTypeFilter).previouslyCreatedElements : []
  );
  const [typeFilters, setTypeFilters] = useRecoilState(activeTypeFilterParamsState);

  const { elementsWithDateTimeEntry, comparators } = useMemo(
    () => getDateTypeFilterElements(resourceType),
    [resourceType]
  );

  const createTypeFilter = () => {
    const filter = `${resourceType}?${createdTypeParams.map(filter => filter.toTypeFilterString()).join('&')}`;

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
              onOptionSubmit={element => {
                let newFilter: TypeFilterParam;

                if (elementsWithDateTimeEntry?.includes(element))
                  newFilter = new DateTimeParam(element, 'eq', new Date(), comparators ?? []);
                else newFilter = new OtherParam(element, '');
                setCreatedTypeParams([...createdTypeParams, newFilter]);
              }}
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

function getDateTypeFilterElements(type: string) {
  const comparators: ('eq' | 'ne' | 'gt' | 'lt' | 'ge' | 'le' | 'sa' | 'eb' | 'ap')[] = [
    'eq',
    'ne',
    'gt',
    'lt',
    'ge',
    'le',
    'sa',
    'eb',
    'ap'
  ];
  const elementsWithDateTimeEntry = Object.keys(PrimaryDatePaths.parsedPrimaryDatePaths[type]);

  return { elementsWithDateTimeEntry, comparators };
}

// function getDateTypeFilterElements(type: string) {

//   console.log(el  const bundle = DateSearchParameters.SearchParameters;
//   const entries = bundle.entry;
//   const thiselem = entries?.filter(entry => entry.resource?.id?.split('-')[0] === type);
//   const dateTimeElems = thiselem?.map(val => val.resource as SearchParameter);
//   const elementsWithDateTimeEntry = dateTimeElems?.flatMap(dat => handleCompoundExpression(dat.xpath ?? ''));
//   const comparators = dateTimeElems?.map(dat => dat.comparator)[0];ementsWithDateTimeEntry);

//   return { elementsWithDateTimeEntry, comparators };
// }

// function handleCompoundExpression(str: string) {
//   const asdf = str.split('|');
//   console.log(asdf);
//   if (asdf.length === 1) return asdf[0].slice(asdf[0].lastIndexOf(':')).replace(':', '').trim();
//   else return asdf.map(val => val.slice(val.lastIndexOf(':')).replace(':', '').trim());
// }

function getPreviouslyCreatedElements(typeFilter: string) {
  const previouslyCreatedElements: TypeFilterParam[] = [];
  const pattern = /[?&]([^=]+)=([^&]+)/g;
  const queryParams: Record<string, string> = {};
  let match;
  while ((match = pattern.exec(typeFilter)) !== null) {
    queryParams[match[1]] = match[2];
  }
  const { elementsWithDateTimeEntry, comparators } = getDateTypeFilterElements(typeFilter.split('?')[0]);

  const elements = Object.keys(queryParams);

  for (const elem of elements) {
    if (elementsWithDateTimeEntry.includes(elem)) {
      const value = queryParams[elem];
      const compare = value.split(' ')[0];
      const date = value.slice(value.indexOf(' '));
      previouslyCreatedElements.push(new DateTimeParam(elem, compare, new Date(date), comparators));
      console.log(date);
    } else {
      previouslyCreatedElements.push(new OtherParam(elem, queryParams[elem]));
    }
  }
  // console.log(queryParams);
  // console.log(previouslyCreatedElements);
  return { previouslyCreatedElements, elements };
}
