import { activeTypeFiltersState, inactiveTypeFiltersState } from '@/state/selectors/type-filter-selectors';
import { TypeFilter, typeFilterParamsState } from '@/state/type-filter-params-state';
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
import { useRecoilState, useRecoilValue } from 'recoil';

export default function TypeFilterTable({ setFilterInput }: { setFilterInput: Dispatch<SetStateAction<string>> }) {
  const [typeFilters, setTypeFilters] = useRecoilState(typeFilterParamsState);
  const activeTypeFilters = useRecoilValue(activeTypeFiltersState);
  const inactiveTypeFilters = useRecoilValue(inactiveTypeFiltersState);
  const toggleTypeFilter = (thisTypeFilter: TypeFilter) => {
    const toggledList = typeFilters.map(typeFilter => {
      return {
        filter: typeFilter.filter,
        active: typeFilter.filter === thisTypeFilter.filter ? !typeFilter.active : typeFilter.active
      } as TypeFilter;
    });

    setTypeFilters(toggledList);
  };

  const toggleAll = () => {
    if (inactiveTypeFilters.length === 0)
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
        <TableTr>
          <TableTh>
            <Checkbox
              checked={inactiveTypeFilters.length === 0 && typeFilters.length > 0}
              disabled={typeFilters.length === 0}
              indeterminate={activeTypeFilters.length > 0 && inactiveTypeFilters.length > 0}
              onClick={() => toggleAll()}
            />
          </TableTh>
          <TableTh>Resource Type</TableTh>
          <TableTh>Type Filter</TableTh>
          <TableTh></TableTh>
          <TableTh></TableTh>
        </TableTr>
      </TableThead>
      <TableTbody>
        {typeFilters.map(typeFilter => (
          <TableTr key={typeFilter.filter} bg={typeFilter.active ? 'var(--mantine-color-blue-light)' : undefined}>
            <TableTd>
              <Checkbox
                aria-label="Select row"
                checked={typeFilter.active}
                onChange={() => toggleTypeFilter(typeFilter)}
              />
            </TableTd>
            <TableTd c="blue.9" fw={700}>
              {typeFilter.filter.split('?')[0]}
            </TableTd>
            <TableTd>{typeFilter.filter.slice(typeFilter.filter.indexOf('?') + 1)}</TableTd>
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
