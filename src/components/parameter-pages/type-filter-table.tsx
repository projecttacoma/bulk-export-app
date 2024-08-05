import { activeTypeFilterParamsState, TypeFilter } from '@/state/type-filter-params-state';
import {
  Button,
  Checkbox,
  CloseButton,
  Table,
  TableCaption,
  TableTbody,
  TableTd,
  TableTh,
  TableThead,
  Text,
  TableTr,
  ActionIcon,
  Tooltip,
  Flex
} from '@mantine/core';
import { IconCopy } from '@tabler/icons-react';
import { Dispatch, SetStateAction } from 'react';
import { useRecoilState } from 'recoil';

export default function TypeFilterTable({ setFilterInput }: { setFilterInput: Dispatch<SetStateAction<string>> }) {
  const [typeFilters, setTypeFilters] = useRecoilState(activeTypeFilterParamsState);

  const toggleCheckbox = (thisTypeFilter: TypeFilter) => {
    const toggledList = typeFilters.map(typeFilter => {
      return {
        filter: typeFilter.filter,
        active: typeFilter.filter === thisTypeFilter.filter ? !typeFilter.active : typeFilter.active
      } as TypeFilter;
    });

    setTypeFilters(toggledList);
  };

  const toggleAll = () => {
    if (typeFilters.filter(typeFilter => !typeFilter.active).length === 0)
      setTypeFilters(
        typeFilters.map(typeFilter => {
          return { filter: typeFilter.filter, active: false };
        })
      );
    else
      setTypeFilters(
        typeFilters.map(typeFilter => {
          return { filter: typeFilter.filter, active: true };
        })
      );
  };

  return (
    <Table withTableBorder>
      <TableThead bg="gray.2">
        <TableTh>
          <Checkbox
            checked={typeFilters.filter(val => !val.active).length === 0 && typeFilters.length !== 0}
            disabled={typeFilters.length === 0}
            indeterminate={
              typeFilters.filter(val => val.active).length >= 1 && typeFilters.filter(val => !val.active).length !== 0
            }
            onClick={() => toggleAll()}
          />
        </TableTh>
        <TableTh>Resource Type</TableTh>
        <TableTh>Type Filter</TableTh>
        <TableTh></TableTh>
        <TableTh></TableTh>
      </TableThead>
      <TableTbody>
        {typeFilters.map(typeFilter => (
          <TableTr key={typeFilter.filter} bg={typeFilter.active ? 'var(--mantine-color-blue-light)' : undefined}>
            <TableTd>
              <Checkbox
                aria-label="Select row"
                checked={typeFilter.active}
                onChange={() => toggleCheckbox(typeFilter)}
              />
            </TableTd>
            <TableTd c="blue.9" fw={700}>
              {typeFilter.filter.split('?')[0]}
            </TableTd>
            <TableTd>{typeFilter.filter.split('?')[1]}</TableTd>
            <TableTd>
              <Tooltip label="Create new filter based on this one" openDelay={1500}>
                <ActionIcon variant="transparent">
                  <IconCopy onClick={() => setFilterInput(typeFilter.filter)}></IconCopy>
                </ActionIcon>
              </Tooltip>
            </TableTd>
            <TableTd>
              <CloseButton
                onClick={() =>
                  setTypeFilters(typeFilters.filter(activeFilter => activeFilter.filter !== typeFilter.filter))
                }
              />
            </TableTd>
          </TableTr>
        ))}
      </TableTbody>
      <TableCaption>
        {typeFilters.length === 0 && (
          <Text mb="lg" c="gray">
            No type filters created
          </Text>
        )}
        <Flex justify="right">
          <Button color="red" onClick={() => setTypeFilters([])} disabled={typeFilters.length === 0}>
            Remove All
          </Button>
        </Flex>
      </TableCaption>
    </Table>
  );
}
