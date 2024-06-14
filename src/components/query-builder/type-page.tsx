import { activeTypeParamsState } from '@/state/active-type-params';
import { MultiSelect } from '@mantine/core';
import { useState } from 'react';
import { useRecoilState } from 'recoil';

function TypePage() {
  const data = [
    'type1',
    'type2',
    'type3',
    'type11',
    'type12',
    'type13',
    'type21',
    'type22',
    'type23',
    'type211',
    'type212',
    'type213'
  ];
  const [typeParams, setTypeParams] = useRecoilState(activeTypeParamsState);

  console.log(typeParams);

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

export default TypePage;
