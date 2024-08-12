import { MultiSelectProps, Tooltip, Card, Group, Title, Select, TextInput, Text } from '@mantine/core';
import { DateValue, DateTimePicker } from '@mantine/dates';
import { searchParameters } from 'fhir-spec-tools/build/data/searchParameters';
import { useEffect, useState } from 'react';

const dateComparatorsWithText: Record<string, string> = {
  eq: 'Equals',
  ne: 'Not equals',
  gt: 'Greater than',
  lt: 'Less than',
  ge: 'Greater than or equal',
  le: 'Less than or equal',
  sa: 'Starts after (used for date period specification)',
  eb: 'Ends before (used for date period specification)',
  ap: 'Approximately'
};

export interface TypeFilterData {
  type: string;
  element: string;
  date?: DateValue;
  comparator?: string;
  value?: string;
}

export interface TypeFilterParamInputProps extends TypeFilterData {
  createFilter: (element: string, filter: string) => void;
}

export interface TypeFilterDateInputProps {
  type: string;
  element: string;
  comparator: string;
  date: DateValue;
  createFilter: (element: string, filter: string) => void;
}

export interface TypeFilterOpenInputProps {
  type: string;
  element: string;
  value: string;
  createFilter: (element: string, filter: string) => void;
}

/*
 * Parent component to render and handle logic with all kids of type filter inputs
 */
export function TypeFilterParamInput({
  type,
  element,
  createFilter,
  value,
  date,
  comparator
}: TypeFilterParamInputProps) {
  switch (searchParameters[type][element]) {
    case 'date':
      return (
        <TypeFilterDateInput
          type={type}
          element={element}
          date={date ?? null}
          comparator={comparator ?? 'eq'}
          createFilter={createFilter}
        />
      );
    default:
      return <TypeFilterOpenInput type={type} element={element} value={value ?? ''} createFilter={createFilter} />;
  }
}

/*
 * Component to render and handle logic with type filter inputs that are DateTime inputs
 */
function TypeFilterDateInput(props: TypeFilterDateInputProps) {
  const renderOption: MultiSelectProps['renderOption'] = ({ option }) => {
    return (
      <Tooltip label={dateComparatorsWithText[option.value]} position="right" withArrow>
        <Text inherit>{option.value}</Text>
      </Tooltip>
    );
  };
  const [selectedComparator, setSelectedComparator] = useState<string | null>(props.comparator);
  const [selectedDate, setSelectedDate] = useState(props.date);

  useEffect(() => {
    if (selectedComparator && selectedDate)
      props.createFilter(props.element, `${props.element}=${selectedComparator}${selectedDate?.toISOString()}`);
  }, [selectedComparator, selectedDate]);

  return (
    <Card pl="sm" pr="sm" mt="sm" mb="sm" pt="xs" pb="xs" shadow="none" withBorder>
      <Group grow align="center">
        <Title fw={600} order={5}>
          <Text c="blue.9" inherit span pr="sm">
            {props.element}
          </Text>
          <Text inherit span>
            =
          </Text>
        </Title>
        <Group grow>
          <Select
            size="md"
            radius="md"
            allowDeselect={false}
            data={Object.keys(dateComparatorsWithText)}
            value={selectedComparator}
            renderOption={renderOption}
            onChange={setSelectedComparator}
          />
          <DateTimePicker
            size="md"
            radius="md"
            dropdownType="modal"
            valueFormat="MMM DD YYYY - hh:mm A"
            placeholder="Pick date and time"
            defaultLevel="decade"
            defaultValue={props.date}
            onChange={setSelectedDate}
          />
        </Group>
      </Group>
    </Card>
  );
}

/*
 * Component to render and handle logic with type filter inputs that are text boxes
 */
function TypeFilterOpenInput(props: TypeFilterOpenInputProps) {
  const [textVal, setTextVal] = useState<string>(props.value);

  useEffect(() => {
    if (textVal) props.createFilter(props.element, `${props.element}=${textVal.trim()}`);
  }, [textVal]);

  return (
    <Card pl="sm" pr="sm" mt="sm" mb="sm" pt="xs" pb="xs" shadow="none" withBorder>
      <Group grow align="center">
        <Title fw={600} order={5}>
          <Text c="blue.9" inherit span pr="sm">
            {props.element}
          </Text>
          <Text inherit span>
            =
          </Text>
        </Title>
        <TextInput
          onChange={event => setTextVal(event.currentTarget.value)}
          placeholder="Filter value"
          defaultValue={props.value}
        />
      </Group>
    </Card>
  );
}
