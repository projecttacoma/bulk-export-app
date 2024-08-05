'use client';

import { Text, Modal, MultiSelect, Title, Stack, MultiSelectProps } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { ReactNode, useState } from 'react';
import ElementsModal from './elements-modal';
import { useRecoilState } from 'recoil';
import { activeTypeElementParamsState } from '@/state/type-element-params-state';
import { IconPencil } from '@tabler/icons-react';
import { activeElementParamsState } from '@/state/element-params-state';
import { allSupportedElements, resourceTypesDropdownData } from '@/util/multiselectUtil';

import classes from '@/app/global.module.css';

/*
 * Component for the Element tab on the query-builder page to select _element filters.
 */
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

  const renderOption: MultiSelectProps['renderOption'] = ({ option }) => {
    const isActive = activeTypeElements.some(type => type.type === option.value);

    return (
      <>
        {isActive && <IconPencil />}
        <Text>{option.value}</Text>
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
        label="Select Elements to Query on all Resource Types"
        className={classes.MultiSelectStyles}
        placeholder="Search for elements"
        nothingFoundMessage="No elements matching search found."
        data={allSupportedElements}
        value={activeElements}
        onChange={setActiveElements}
        hidePickedOptions
      />
      <Modal.Root opened={opened} onClose={close} size="75%" radius="md">
        <Modal.Overlay />
        <Modal.Content>{modalContent}</Modal.Content>
      </Modal.Root>
    </Stack>
  );
}
