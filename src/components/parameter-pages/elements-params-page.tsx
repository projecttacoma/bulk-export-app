'use client';

import { Text, Modal, MultiSelect, Title, ComboboxLikeRenderOptionInput, ComboboxItem, Stack } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { resourceTypes } from '../../../data/supportedResources';
import { ReactNode, useState } from 'react';
import ElementsModal from './elements-modal';
import { useRecoilState } from 'recoil';
import { activeTypeElementParamsState } from '@/state/type-element-params-state';
import { IconPencil } from '@tabler/icons-react';
import { activeElementParamsState } from '@/state/element-params-state';

import classes from '@/app/global.module.css';
import { supportedElements } from '../../../data/supportedElements';

const resourceTypesDropdownData = resourceTypes.map(value => {
  return {
    label: value,
    value: value
  };
});

export default function ElementParamsPage() {
  const [opened, { open, close }] = useDisclosure(false);
  const [modalContent, setModalContent] = useState<ReactNode>();
  const [activeTypeElements, setActiveTypeElementParams] = useRecoilState(activeTypeElementParamsState);
  const [activeElements, setActiveElements] = useRecoilState(activeElementParamsState);

  const createActiveTypeElements = () =>
    activeTypeElements.map(element => `${element.type}: ${element.elements.join(', ')}`);

  const handleRemoveValue = (removedValue: string) => {
    const newActiveElements = activeTypeElements.filter(element => element.type !== removedValue.split(':')[0]);
    setActiveTypeElementParams(newActiveElements);
  };

  const handleSubmitValue = (value: string) => {
    const editing = activeTypeElements.some(element => element.type === value);
    setModalContent(<ElementsModal resourceType={value} closeModal={close} editing={editing} />);
    open();
  };

  const renderOption = (item: ComboboxLikeRenderOptionInput<ComboboxItem>) => {
    const isActive = activeTypeElements.some(type => type.type === item.option.value);

    return (
      <>
        {isActive && <IconPencil />}
        <Text>{item.option.value}</Text>
        {isActive && <Text c="blue.6">- Active</Text>}
      </>
    );
  };

  return (
    <Stack gap="lg">
      <Title order={2}>Element Parameter Selection</Title>
      <MultiSelect
        label="Select Types and Elements"
        className={classes.MultiSelectStyles}
        placeholder="Search for types"
        nothingFoundMessage="No types matching search found."
        data={resourceTypesDropdownData}
        value={createActiveTypeElements()}
        renderOption={renderOption}
        onOptionSubmit={handleSubmitValue}
        onRemove={handleRemoveValue}
        onClear={() => setActiveTypeElementParams([])}
      />
      <MultiSelect
        data={supportedElements}
        value={activeElements}
        onChange={setActiveElements}
        label="Select Elements to Query on all Resource Types"
        placeholder="Search for elements"
        nothingFoundMessage="No elements matching search found."
        hidePickedOptions
        className={classes.MultiSelectStyles}
      />
      <Modal.Root opened={opened} onClose={close} size="75%" radius="md">
        <Modal.Overlay />
        <Modal.Content>{modalContent}</Modal.Content>
      </Modal.Root>
    </Stack>
  );
}
