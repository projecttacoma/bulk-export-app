'use client';
import { MultiSelect } from '@mantine/core';
import { useState } from 'react';

export default function TypeParamsMultiSelect({ data }: { data: string[] }) {
  // will later be a global state hook
  const [typeParams, setTypeParams] = useState<string[]>([]);
  return (
    <MultiSelect
      size="lg"
      radius="lg"
      label={'Select Types to Query'}
      placeholder="Search for an type"
      data={data}
      searchable
      nothingFoundMessage="Nothing found..."
      value={typeParams}
      onChange={setTypeParams}
    />
  );
}
