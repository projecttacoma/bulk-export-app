'use client';
import { activeTypeParamsState } from '@/state/type-params-state';
import {
  Table,
  ActionIcon,
  CloseIcon,
  TableScrollContainer,
  TableTbody,
  TableTh,
  TableThead,
  TableTr,
  TableTd
} from '@mantine/core';
import { useRecoilState } from 'recoil';

export default function ParamsTable() {
  const [typeParams, setTypeParams] = useRecoilState(activeTypeParamsState);

  console.log(typeParams);

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
            <TableTr key={ty}>
              <TableTd>{ty}</TableTd>
              <TableTd></TableTd>
              <TableTd></TableTd>
              <TableTd>
                <ActionIcon>
                  <CloseIcon size="sm" onClick={() => setTypeParams(typeParams.filter(filter => ty != filter))} />
                </ActionIcon>
              </TableTd>
            </TableTr>
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
