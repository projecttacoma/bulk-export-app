'use client';
import { activeTypeParamsState } from '@/state/type-params-state';
import { MultiSelect } from '@mantine/core';
import { useRecoilState } from 'recoil';
import { resourceTypes } from '../../../data/supportedResources';

export default function TypeParamsPage() {
  const [typeParams, setTypeParams] = useRecoilState(activeTypeParamsState);
  return (
    <MultiSelect
      size="lg"
      radius="md"
      mt="md"
      label="Select Types to Query"
      placeholder="Search for an type"
      nothingFoundMessage="Nothing found..."
      searchable
      clearable
      data={resourceTypes}
      value={typeParams}
      onChange={setTypeParams}
      withScrollArea={false}
      styles={{ dropdown: { maxHeight: 350, overflowY: 'auto' } }}
      comboboxProps={{ transitionProps: { transition: 'fade-down', duration: 200 }, offset: 0 }}
    />
  );
}
