import { activeTypeParamsState } from '@/state/type-params-state';
import { Table, ActionIcon, CloseIcon } from '@mantine/core';
import { useRecoilState } from 'recoil';

export default function QueryParams() {
  const [typeParams, setTypeParams] = useRecoilState(activeTypeParamsState);

  return (
    <>
      {typeParams.map(ty => (
        <Table.Tr key={ty}>
          <Table.Td>{ty}</Table.Td>
          <Table.Td></Table.Td> {/* will be elements and type filters details */}
          <Table.Td></Table.Td> {/* will be an edit button only for elements and type filters*/}
          <Table.Td>
            <ActionIcon>
              <CloseIcon size="sm" onClick={() => setTypeParams(typeParams.filter(filter => ty != filter))}></CloseIcon>
            </ActionIcon>
          </Table.Td>
        </Table.Tr>
      ))}
    </>
  );
}
