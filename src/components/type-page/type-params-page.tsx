'use client';

import { MultiSelect, Title, Tooltip } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import { useRecoilState } from 'recoil';
import { resourceTypes } from '../../../data/supportedResources';
import { activeTypeParamsState } from '@/state/type-params-state';

const typeParamsHelpText = `Selected items are added to "_type" parameter of the bulk export request.
   The "_type" parameter is used to select which resource types' data you want to export. By default,
   data for all resource types is returned if a "_type" query is not provided in the export request.`;

export default function TypeParamsPage() {
  const [typeParams, setTypeParams] = useRecoilState(activeTypeParamsState);
  return (
    <>
      <Title order={2}>Type Parameter Selection</Title>
      <MultiSelect
        mt="lg"
        ml="sm"
        size="lg"
        radius="md"
        placeholder="Search for types"
        nothingFoundMessage="No types matching search found."
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
            <IconInfoCircle />
          </Tooltip>
        }
      />
    </>
  );
}
