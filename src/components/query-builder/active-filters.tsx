'use client';
import { Table } from '@mantine/core';
import FilterRow from './filter-row';
import { useRecoilValue } from 'recoil';
import { activeTypeParamsState } from '@/state/active-type-params';

export default function ActiveFilters() {
  //fitler row should come from a atom
  const activeTypeFilters: string[] = useRecoilValue(activeTypeParamsState);

  return (
    <Table highlightOnHover>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Filter Type</Table.Th>
          <Table.Th>Elements</Table.Th>
          <Table.Th>Edit</Table.Th>
          <Table.Th>Remove</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {activeTypeFilters.map(ty => (
          <FilterRow data={ty} />
        ))}
      </Table.Tbody>
    </Table>
  );
}
