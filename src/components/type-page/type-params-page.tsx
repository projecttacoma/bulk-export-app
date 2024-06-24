'use client';
import { activeTypeParamsState } from '@/state/type-params-state';
import { MultiSelect, Title, Tooltip } from '@mantine/core';
import { useRecoilState } from 'recoil';
import { resourceTypes } from '../../../data/supportedResources';
import { IconQuestionMark } from '@tabler/icons-react';

const typeParamsHelpText = `Use this input to select types that you want to 
  include as parameters in your bulk export server query. Only resources of 
  selected types will be returned by the query. By default, if none are selected, 
  all types available to that resource will be included in the query.`;

export default function TypeParamsPage() {
  const [typeParams, setTypeParams] = useRecoilState(activeTypeParamsState);
  return (
    <>
      <Title order={2}>Type Parameter Selection</Title>
      <MultiSelect
        mt="md"
        size="lg"
        radius="md"
        label="Add types to query"
        placeholder="Search for types"
        nothingFoundMessage="Nothing found..."
        clearable
        searchable
        hidePickedOptions
        data={resourceTypes}
        value={typeParams}
        onChange={setTypeParams}
        withScrollArea={false}
        styles={{ dropdown: { maxHeight: 300, overflowY: 'auto' } }}
        comboboxProps={{ transitionProps: { transition: 'fade-down', duration: 200 }, offset: 0 }}
        leftSection={
          <Tooltip
            multiline
            position="right"
            w={500}
            withArrow
            transitionProps={{ duration: 200 }}
            zIndex={400}
            label={typeParamsHelpText}
          >
            <IconQuestionMark />
          </Tooltip>
        }
      />
    </>
  );
}
