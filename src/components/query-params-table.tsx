import { activeTypeParamsState } from '@/state/type-params-state';
import {
  Table,
  ActionIcon,
  CloseIcon,
  TableScrollContainer,
  TableTbody,
  TableTh,
  TableThead,
  TableTr
} from '@mantine/core';
import { useRecoilState } from 'recoil';

export default function ParamsTable() {
  const [typeParams, setTypeParams] = useRecoilState(activeTypeParamsState);

  return (
    <TableScrollContainer minWidth={500} type="native" mah={300} mx="auto">
      <Table highlightOnHover stickyHeader>
        <TableThead>
          <TableTr>
            <TableTh>Filter Type</TableTh>
            <TableTh>Elements</TableTh>
            <TableTh>Edit</TableTh>
            <TableTh>Remove</TableTh>
          </TableTr>
        </TableThead>
        <TableTbody>
          {typeParams.map(ty => (
            <Table.Tr key={ty}>
              <Table.Td>{ty}</Table.Td>
              <Table.Td></Table.Td> {/* will be elements and type filters details */}
              <Table.Td></Table.Td> {/* will be an edit button only for elements and type filters*/}
              <Table.Td>
                <ActionIcon>
                  <CloseIcon
                    size="sm"
                    onClick={() => setTypeParams(typeParams.filter(filter => ty != filter))}
                  ></CloseIcon>
                </ActionIcon>
              </Table.Td>
            </Table.Tr>
          ))}
        </TableTbody>
        {typeParams.length < 1 ? (
          <Table.Caption style={{ padding: '0px 0px 10px 0px' }}>No active parameters.</Table.Caption>
        ) : (
          <></>
        )}
      </Table>
    </TableScrollContainer>
  );
}
