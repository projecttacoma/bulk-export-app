import {
  Button,
  Mark,
  Modal,
  Group,
  Divider,
  Text,
  MultiSelect,
  ComboboxLikeRenderOptionInput,
  ComboboxItem,
  Tooltip,
  Title,
  Badge,
  Grid,
  Card
} from '@mantine/core';
import { useState } from 'react';
import { useRecoilState } from 'recoil';
import { activeTypeElementParamsState, TypeElement } from '@/state/type-element-params-state';

import globalClasses from '@/app/global.module.css';
import { supportedElements } from '../../../data/supportedElements';
import { mandatoryElements } from '../../../data/mandatoryElements';

export interface ElementsModalProps {
  resourceType: string;
  closeModal: () => void;
  editing: boolean;
}

function MandatoryElementList({ resourceType }: { resourceType: string }) {
  const noMandatoryElements = mandatoryElements[resourceType].length === 0;

  return (
    <Tooltip
      label="Mandatory elements will always be exported from the server"
      disabled={noMandatoryElements}
      withArrow
      openDelay={1000}
      position="bottom"
    >
      <Grid align="center" bg="white">
        <Grid.Col span="content">
          <Title order={4} fw={600}>
            Mandatory Elements:
          </Title>
        </Grid.Col>
        <Grid.Col span={'auto'}>
          <Group>
            {mandatoryElements[resourceType].map(element => (
              <Badge size="md">{element}</Badge>
            ))}
            {noMandatoryElements && 'There are no mandatory elements on this resource type.'}
          </Group>
        </Grid.Col>
      </Grid>
    </Tooltip>
  );
}

export default function ElementsModal({ resourceType, closeModal, editing }: ElementsModalProps) {
  const [activeTypeElements, setActiveTypeElements] = useRecoilState(activeTypeElementParamsState);
  const previousSelectedOptions = activeTypeElements.find(value => value.type === resourceType);
  const [selectedOptions, setSelectedOptions] = useState<string[]>(previousSelectedOptions?.elements ?? []);

  const multiselectData = createMultiselectData(resourceType);

  const renderData = (item: ComboboxLikeRenderOptionInput<ComboboxItem>) =>
    item.option.disabled ? (
      <Tooltip
        position="right"
        withArrow
        label={
          <>
            <Mark className={globalClasses.blueText}>{item.option.label}</Mark> is a Mandatory Element on
            <Mark className={globalClasses.blueText}> {resourceType}</Mark> resource.
          </>
        }
      >
        <Text>{item.option.label}</Text>
      </Tooltip>
    ) : (
      <Text>{item.option.label}</Text>
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
        <Card shadow="sm" radius="md" mb="xl">
          <MandatoryElementList resourceType={resourceType} />
        </Card>
        <Card shadow="sm" radius="md">
          <Group grow gap={0} preventGrowOverflow={false} align="flex-end">
            <MultiSelect
              w="70%"
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
          </Group>
        </Card>
      </Modal.Body>
    </>
  );
}

function createMultiselectData(resourceType: string) {
  const createComboData = (element: string, disabled: boolean) => {
    return {
      value: element,
      disabled: disabled,
      label: element
    };
  };

  const optionalElementsData = supportedElements.map(element => createComboData(element, false));

  const mandatoryElementsData = mandatoryElements[resourceType].map(mandatoryElement =>
    createComboData(mandatoryElement, true)
  );

  return optionalElementsData.concat(mandatoryElementsData);
}
