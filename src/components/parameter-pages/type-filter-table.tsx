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
import { Dispatch, ReactNode, SetStateAction } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import TypeFilterModal from './type-filter-modal';
import { activeTypeFiltersState, inactiveTypeFiltersState } from '@/state/selectors/type-filter-selectors';

export default function TypeFilterTable({
  setFilterInput,
  setModalContext,
  closeModal,
  openModal
}: {
  setFilterInput: Dispatch<SetStateAction<string>>;
  setModalContext: Dispatch<SetStateAction<ReactNode>>;
  closeModal: () => void;
  openModal: () => void;
}) {
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
                      setModalContext(
                        <TypeFilterModal
                          resourceType={typeFilter.filter.split('?')[0]}
                          closeModal={closeModal}
                          editingTypeFilter={typeFilter.filter}
                        />
                      );
                      openModal();
                    }}
                  ></IconEdit>
                </ActionIcon>
                <CloseButton
                  onClick={() =>
                    setTypeFilters(typeFilters.filter(typeFilter => typeFilter.filter !== typeFilter.filter))
                  }
                />
              </Group>
            </TableTd>
          </TableTr>
        ))}
      </TableTbody>
      <TableCaption>
        {activeTypeFilters.length === 0 && (
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
