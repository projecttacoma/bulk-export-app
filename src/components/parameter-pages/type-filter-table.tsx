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
  Flex,
  Group
} from '@mantine/core';
import { IconCopy, IconEdit } from '@tabler/icons-react';
import { Dispatch, SetStateAction } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import TypeFilterModal from './type-filter-modal';
import { activeTypeFiltersState, inactiveTypeFiltersState } from '@/state/selectors/type-filter-selectors';
import { modals } from '@mantine/modals';
import classes from '@/app/global.module.css';

export default function TypeFilterTable({ setFilterInput }: { setFilterInput: Dispatch<SetStateAction<string>> }) {
  const [typeFilters, setTypeFilters] = useRecoilState(typeFilterParamsState);
  const activeTypeFilters = useRecoilValue(activeTypeFiltersState);
  const inactiveTypeFilters = useRecoilValue(inactiveTypeFiltersState);

  const toggleTypeFilter = (thisTypeFilter: TypeFilter) =>
    setTypeFilters(
      typeFilters.map(
        typeFilter =>
          ({
            filter: typeFilter.filter,
            active: typeFilter.filter === thisTypeFilter.filter ? !typeFilter.active : typeFilter.active
          }) as TypeFilter
      )
    );

  const toggleAll = () =>
    inactiveTypeFilters.length === 0
      ? setTypeFilters(typeFilters.map(typeFilter => ({ filter: typeFilter.filter, active: false })))
      : setTypeFilters(typeFilters.map(typeFilter => ({ filter: typeFilter.filter, active: true })));

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
          <TableTh />
        </TableTr>
      </TableThead>
      <TableTbody>
        {typeFilters.map((typeFilter, index) => (
          <TableTr key={index} bg={typeFilter.active ? 'var(--mantine-color-blue-light)' : undefined}>
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
            <TableTd>{typeFilter.filter.split('?')[1]}</TableTd>
            <TableTd>
              <Group>
                <Tooltip label="Create new filter based on this one" openDelay={1500}>
                  <ActionIcon variant="transparent">
                    <IconCopy onClick={() => setFilterInput(typeFilter.filter)}></IconCopy>
                  </ActionIcon>
                </Tooltip>
                <ActionIcon variant="transparent">
                  <IconEdit
                    color="blue"
                    onClick={() => {
                      modals.open({
                        title: (
                          <>
                            Edit Type Filter on{' '}
                            <Text span inherit c="blue.9">
                              {typeFilter.filter.split('?')[0]}
                            </Text>{' '}
                            Resource
                          </>
                        ),
                        children: (
                          <TypeFilterModal
                            resourceType={typeFilter.filter.split('?')[0]}
                            editingTypeFilter={typeFilter.filter}
                          />
                        ),
                        size: '75%',
                        classNames: {
                          title: classes.modalHeader
                        }
                      });
                    }}
                  ></IconEdit>
                </ActionIcon>
                <CloseButton
                  onClick={() =>
                    setTypeFilters(typeFilters.filter(prevTypeFilter => prevTypeFilter.filter !== typeFilter.filter))
                  }
                />
              </Group>
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
          <Button color="red" onClick={() => setTypeFilters([])} disabled={activeTypeFilters.length === 0}>
            Remove All
          </Button>
        </Flex>
      </TableCaption>
    </Table>
  );
}
