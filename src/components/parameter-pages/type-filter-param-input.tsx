import { MultiSelectProps, Tooltip, Card, Group, Title, Select, TextInput, Text, rem, ActionIcon } from '@mantine/core';
import { DateValue, DatePicker, TimeInput } from '@mantine/dates';
import { IconClock, IconX } from '@tabler/icons-react';
import { searchParameters } from 'fhir-spec-tools/build/data/searchParameters';
import { useState } from 'react';

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
  value?: string;
}

export interface TypeFilterParamInputProps extends TypeFilterData {
  addFilter: (element: string, value: string) => void;
}

export interface TypeFilterDateInputProps {
  type: string;
  element: string;
  comparator: string;
  date: DateValue;
  addFilter: (element: string, value: string) => void;
}

export interface TypeFilterOpenInputProps {
  type: string;
  element: string;
  value: string;
  addFilter: (element: string, value: string) => void;
}

/*
 * Parent component to render and handle logic with all kids of type filter inputs
 */
export function TypeFilterParamInput({ type, element, addFilter, value }: TypeFilterParamInputProps) {
  switch (searchParameters[type][element]) {
    case 'date':
      return (
        <TypeFilterDateInput
          type={type}
          element={element}
          date={value ? new Date(value.substring(2)) : null}
          comparator={value ? value.substring(0, 2) : 'eq'}
          addFilter={addFilter}
        />
      );
    default:
      return <TypeFilterOpenInput type={type} element={element} value={value ?? ''} addFilter={addFilter} />;
  }
}

/*
 * Component to render and handle logic with type filter inputs that are DateTime inputs
 */
function TypeFilterDateInput(props: TypeFilterDateInputProps) {
  const [selectedComparator, setSelectedComparator] = useState<string | null>(props.comparator);
  const [selectedDate, setSelectedDate] = useState(props.date);
  const [selectedTime, setSelectedTime] = useState(
    props.date?.toLocaleTimeString('en-US', {
      hour12: false
    }) ?? ''
  );

  const onBlurEffect = (noSelectedTime: boolean) => {
    if (selectedComparator && selectedDate) {
      let dateISOTime: string;
      if (noSelectedTime) {
        dateISOTime = selectedDate.toISOString().split('T')[0];
      } else {
        const [hours, minutes, seconds] = selectedTime.split(':').map(Number);
        selectedDate.setHours(hours, minutes, seconds);

        dateISOTime = selectedDate.toISOString();
      }
      props.addFilter(props.element, `${selectedComparator}${dateISOTime}`);
    }
  };

  const renderOption: MultiSelectProps['renderOption'] = ({ option }) => {
    return (
      <Tooltip label={dateComparatorsWithText[option.value]} position="right" withArrow>
        <Text inherit>{option.value}</Text>
      </Tooltip>
    );
  };

  return (
    <Card pl="sm" pr="sm" mt="sm" mb="sm" pt="xs" pb="xs" shadow="none" withBorder>
      <Group justify="space-between">
        <Title fw={600} order={5}>
          <Text c="blue.9" inherit span pr="sm">
            {props.element}
          </Text>
          <Text inherit span>
            =
          </Text>
        </Title>
        <Group gap="xl" justify="center" align="center">
          <Select
            size="sm"
            onBlur={() => onBlurEffect(selectedTime === '')}
            label="comparator"
            required
            w={100}
            allowDeselect={false}
            data={Object.keys(dateComparatorsWithText)}
            value={selectedComparator}
            renderOption={renderOption}
            onChange={setSelectedComparator}
          />
          <DatePicker
            size="sm"
            defaultLevel={props.date ? 'month' : 'decade'}
            defaultDate={props.date ?? undefined}
            defaultValue={props.date}
            onChange={setSelectedDate}
            onBlur={() => onBlurEffect(selectedTime === '')}
          />
          <TimeInput
            size="sm"
            label="time"
            inputWrapperOrder={['label', 'input', 'description']}
            description="optional"
            withSeconds
            value={selectedTime}
            leftSection={<IconClock style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
            onChange={event => setSelectedTime(event.currentTarget.value)}
            onBlur={() => onBlurEffect(selectedTime === '')}
            rightSection={
              <ActionIcon
                variant="transparent"
                onClick={() => {
                  setSelectedTime('');
                  onBlurEffect(true);
                }}
              >
                <IconX color="gray" />
              </ActionIcon>
            }
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
          onBlur={() => {
            if (textVal) props.addFilter(props.element, textVal.trim());
          }}
          onChange={event => setTextVal(event.currentTarget.value)}
          placeholder="Filter value"
          defaultValue={props.value}
        />
      </Group>
    </Card>
  );
}
