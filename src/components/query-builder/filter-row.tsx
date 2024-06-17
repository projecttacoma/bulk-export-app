import { activeTypeParamsState } from '@/state/active-type-params';
import { Button, Table } from '@mantine/core';
import { useRecoilState, useSetRecoilState } from 'recoil';

export default function FilterRow({ data }: { data: string }) {
  const [selectedFilters, setSelectedFilters] = useRecoilState(activeTypeParamsState);
  console.log(data);
  return (
    <Table.Tr key={data}>
      <Table.Td>{data}</Table.Td>
      <Table.Td></Table.Td>
      <Table.Td>
        <Button>E</Button>
      </Table.Td>
      <Table.Td>
        <Button onClick={() => setSelectedFilters(selectedFilters.filter(filter => data != filter))}>X</Button>
      </Table.Td>
    </Table.Tr>
  );
}
