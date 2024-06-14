import { Button, Table } from '@mantine/core';

export default function FilterRow({ data }: { data: string }) {
  return (
    <Table.Tr key={data}>
      <Table.Td>{data}</Table.Td>
      <Table.Td></Table.Td>
      <Table.Td>
        <Button></Button>
      </Table.Td>
      <Table.Td>
        <Button></Button>
      </Table.Td>
    </Table.Tr>
  );
}
