import { MultiSelectProps, Tooltip, Card, Group, Title, Select, TextInput, Text } from '@mantine/core';
import { DateValue, DateTimePicker } from '@mantine/dates';
import { useEffect, useState } from 'react';
import { SearchParameters } from '../../../data/searchParameters';

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

export interface TypeFilterParamInputProps {
  type: string;
  element: string;
  createFilter: (element: string, filter: string) => void;
  date?: DateValue;
  comparator?: string;
  value?: string;
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
  switch (SearchParameters[type][element]) {
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
  const [compInput, setCompInput] = useState<string | null>(props.comparator);
  const [dateInput, setDateInput] = useState<DateValue>(props.date);

  useEffect(() => {
    if (compInput && dateInput)
      props.createFilter(props.element, `${props.element}=${compInput}${dateInput?.toISOString()}`);
  }, [compInput, dateInput]);

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
            renderOption={renderOption}
            value={compInput}
            allowDeselect={false}
            radius="md"
            size="md"
            data={Object.keys(dateComparatorsWithText)}
            onChange={setCompInput}
          />
          <DateTimePicker
            valueFormat="DD MMM YYYY hh:mm A"
            defaultValue={props.date}
            dropdownType="modal"
            size="md"
            radius="md"
            onChange={setDateInput}
            placeholder="Pick date and time"
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
