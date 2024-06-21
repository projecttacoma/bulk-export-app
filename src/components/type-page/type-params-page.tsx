'use client';
import { activeTypeParamsState } from '@/state/type-params-state';
import { MultiSelect, Tooltip } from '@mantine/core';
import { useRecoilState } from 'recoil';
import { resourceTypes } from '../../../data/supportedResources';
import { IconQuestionMark } from '@tabler/icons-react';

export default function TypeParamsPage() {
  const [typeParams, setTypeParams] = useRecoilState(activeTypeParamsState);
  return (
    <MultiSelect
      mt="md"
      size="lg"
      radius="md"
      label="Select Types to Query"
      placeholder="Search for an type"
      nothingFoundMessage="Nothing found..."
      clearable
      searchable
      data={resourceTypes}
      value={typeParams}
      onChange={setTypeParams}
      withScrollArea={false}
      styles={{ dropdown: { maxHeight: 350, overflowY: 'auto' } }}
      comboboxProps={{ transitionProps: { transition: 'fade-down', duration: 200 }, offset: 0 }}
      leftSection={
        <Tooltip
          multiline
          position="bottom"
          w={500}
          withArrow
          transitionProps={{ duration: 200 }}
          zIndex={400}
          label="Use this input to select types that you want to include as parameters in your bulk export server query. By default, if none are selected, all types available to that resource will be included in the query."
        >
          <IconQuestionMark />
        </Tooltip>
      }
    />
  );
}
