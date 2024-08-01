import {
  Button,
  Mark,
  Modal,
  Divider,
  Text,
  MultiSelect,
  ComboboxItem,
  Tooltip,
  Grid,
  Card,
  MultiSelectProps,
  GridCol
} from '@mantine/core';
import { useState } from 'react';
import { useRecoilState } from 'recoil';
import { activeTypeElementParamsState, TypeElement } from '@/state/type-element-params-state';

import globalClasses from '@/app/global.module.css';
import { mandatoryElements } from '../../../data/mandatoryElements';
import { supportedElements } from '../../../data/supportedElements';
import MandatoryElementList from './mandatory-elements';

export interface ElementsModalProps {
  resourceType: string;
  closeModal: () => void;
  editing: boolean;
}

export default function ElementsModal({ resourceType, closeModal, editing }: ElementsModalProps) {
  const [activeTypeElements, setActiveTypeElements] = useRecoilState(activeTypeElementParamsState);
  const previousSelectedOptions = activeTypeElements.find(value => value.type === resourceType);
  const [selectedOptions, setSelectedOptions] = useState<string[]>(previousSelectedOptions?.elements ?? []);

  const multiselectData = createComboBoxData(resourceType);

  const renderData: MultiSelectProps['renderOption'] = ({ option }) =>
    option.disabled ? (
      <Tooltip
        position="right"
        withArrow
        label={
          <>
            <Mark className={globalClasses.blueText}>{option.label}</Mark> is a Mandatory Element on
            <Mark className={globalClasses.blueText}> {resourceType}</Mark> resource.
          </>
        }
      >
        <Text>{option.label}</Text>
      </Tooltip>
    ) : (
      <Text>{option.label}</Text>
    );
  return (
    <>
      <Modal.Header>
        <Modal.Title fz={'h2'} fw={700}>
          Exported Elements on <Mark className={globalClasses.blueText}>{resourceType}</Mark> Resource
        </Modal.Title>
        <Modal.CloseButton />
      </Modal.Header>
      <Divider />
      <Modal.Body bg="gray.0" p="xl">
        <Grid align="center">
          <GridCol span={12}>
            <Card>
              <MandatoryElementList resourceType={resourceType} />
            </Card>
          </GridCol>
          <Grid.Col span="auto">
            <Card>
              <MultiSelect
                label="Select Elements"
                description="Use this input to search and select elements to add to the export query"
                placeholder="Search for elements"
                nothingFoundMessage="No elements matching search found."
                hidePickedOptions
                data={multiselectData}
                value={selectedOptions}
                onChange={setSelectedOptions}
                renderOption={renderData}
              />
            </Card>
          </Grid.Col>
          <GridCol span={{ base: 12, lg: 3 }}>
            <Card p={0}>
              <Button
                size="lg"
                variant="subtle"
                disabled={selectedOptions.length === 0}
                onClick={() => {
                  const newTypeElement: TypeElement = {
                    type: resourceType,
                    elements: selectedOptions
                  };
                  const removedOthers = activeTypeElements.filter(value => value.type !== newTypeElement.type);

                  removedOthers.push(newTypeElement);

                  setActiveTypeElements(removedOthers);
                  closeModal();
                }}
              >
                {editing ? 'Confirm Update' : 'Add Elements'}
              </Button>
              {editing && (
                <Button
                  size="lg"
                  variant="subtle"
                  color="red"
                  onClick={() => {
                    const removedOthers = activeTypeElements.filter(value => value.type !== resourceType);
                    setActiveTypeElements(removedOthers);
                    closeModal();
                  }}
                >
                  Remove
                </Button>
              )}
            </Card>
          </GridCol>
        </Grid>
      </Modal.Body>
    </>
  );
}

function createComboBoxData(resourceType: string) {
  const compareComboBoxItems = (a: ComboboxItem, b: ComboboxItem) => {
    return Number(a.disabled) - Number(b.disabled);
  };

  return supportedElements[resourceType]
    .map((element: string) => {
      return {
        value: element,
        disabled: mandatoryElements[resourceType].includes(element),
        label: element
      } as ComboboxItem;
    })
    .sort((a: ComboboxItem, b: ComboboxItem) => compareComboBoxItems(a, b));
}
