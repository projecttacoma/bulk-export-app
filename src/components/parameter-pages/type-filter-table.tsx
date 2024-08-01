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
  Flex,
  Group
} from '@mantine/core';
import { IconCopy, IconEdit } from '@tabler/icons-react';
import { Dispatch, ReactNode, SetStateAction } from 'react';
import { useRecoilState } from 'recoil';
import TypeFilterModal from './type-filter-modal';

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
  const [activeTypeFilters, setActiveTypeFilters] = useRecoilState(activeTypeFilterParamsState);

  const toggleCheckbox = (thisTypeFilter: TypeFilter) => {
    const toggledList: TypeFilter[] = activeTypeFilters.map(activeFilter => {
      return {
        filter: activeFilter.filter,
        active: activeFilter.filter === thisTypeFilter.filter ? !activeFilter.active : activeFilter.active
      };
    });

    setActiveTypeFilters(toggledList);
  };

  const toggleAll = () => {
    if (activeTypeFilters.filter(typeFilter => !typeFilter.active).length === 0)
      setActiveTypeFilters(
        activeTypeFilters.map(typeFilter => {
          return { filter: typeFilter.filter, active: false };
        })
      );
    else
      setActiveTypeFilters(
        activeTypeFilters.map(typeFilter => {
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
              checked={activeTypeFilters.filter(val => !val.active).length === 0 && activeTypeFilters.length !== 0}
              disabled={activeTypeFilters.length === 0}
              indeterminate={
                activeTypeFilters.filter(val => val.active).length >= 1 &&
                activeTypeFilters.filter(val => !val.active).length !== 0
              }
              onClick={() => toggleAll()}
            />
          </TableTh>
          <TableTh>Resource Type</TableTh>
          <TableTh>Type Filter</TableTh>
          <TableTh></TableTh>
        </TableTr>
      </TableThead>
      <TableTbody>
        {activeTypeFilters.map(typeFilter => (
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
                    setActiveTypeFilters(
                      activeTypeFilters.filter(activeFilter => activeFilter.filter !== typeFilter.filter)
                    )
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
          <Button color="red" onClick={() => setActiveTypeFilters([])} disabled={activeTypeFilters.length === 0}>
            Remove All
          </Button>
        </Flex>
      </TableCaption>
    </Table>
  );
}
