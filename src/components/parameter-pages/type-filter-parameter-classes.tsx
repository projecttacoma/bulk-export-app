import { Select, TextInput, Text, Title, Card, Group, MultiSelectProps, Tooltip } from '@mantine/core';
import { DateValue, DateTimePicker } from '@mantine/dates';
import { choiceTypes } from 'fhir-spec-tools/build/data/choiceTypes';
import { parsedPrimaryDatePaths } from 'fhir-spec-tools/build/data/primaryDatePaths';

const comparatorsKeyValue: Record<string, string> = {
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

export abstract class TypeFilterParam {
  elementName: string;

  constructor(element: string) {
    this.elementName = element;
  }
  abstract render(): React.ReactElement;
  abstract toTypeFilterString(): string;

  static createParameter(type: string, element: string, value?: string, date?: DateValue, comparator?: string) {
    if (this.check(type, element)) return new DateTimeParam(element, comparator ?? 'eq', date ?? null);
    else return new OtherParam(element, value);
  }

  private static check(type: string, element: string): boolean {
    // If the element is a date and not a choice type
    if (parsedPrimaryDatePaths[type][element]) return true;

    const choiceTypeElementsOnType = Object.keys(choiceTypes[type]).map(elem => elem.split('[')[0]);
    const baseChoiceTypeElem = choiceTypeElementsOnType.find(choiceTypeElem => element.includes(choiceTypeElem));

    // Element is not a choice type and not a date
    if (!baseChoiceTypeElem) return false;

    const baseElemIsDate = parsedPrimaryDatePaths[type][baseChoiceTypeElem];

    if (baseElemIsDate) return true;

    return false;
  }
}

export class DateTimeParam extends TypeFilterParam {
  comparators = ['eq', 'ne', 'gt', 'lt', 'ge', 'le', 'sa', 'eb', 'ap'];
  compare: string;
  date: DateValue;
  constructor(elem: string, compare: string, date: DateValue) {
    super(elem);
    this.compare = compare;
    this.date = date;
  }
  public render() {
    const renderOption: MultiSelectProps['renderOption'] = ({ option }) => {
      return (
        <Tooltip label={comparatorsKeyValue[option.value]} position="right" withArrow>
          <Text inherit>{option.value}</Text>
        </Tooltip>
      );
    };

    return (
      <Card pl="sm" pr="sm" mt="sm" mb="sm" pt="xs" pb="xs" shadow="none" withBorder>
        <Group grow align="center">
          <Title fw={600} order={5}>
            <Text c="blue.9" inherit span pr="sm">
              {this.elementName}
            </Text>
            <Text inherit span>
              =
            </Text>
          </Title>
          <Group grow>
            <Select
              renderOption={renderOption}
              defaultValue={this.compare}
              allowDeselect={false}
              radius="md"
              size="md"
              data={Object.keys(comparatorsKeyValue)}
              onChange={value => (this.compare = value ?? '')}
            />
            <DateTimePicker
              valueFormat="DD MMM YYYY hh:mm A"
              defaultValue={this.date}
              size="md"
              radius="md"
              onChange={value => (this.date = value)}
              placeholder="Pick date and time"
            />
          </Group>
        </Group>
      </Card>
    );
  }

  public toTypeFilterString() {
    if (!this.date) return '';
    return `${this.elementName}=${this.compare}${this.date?.toISOString()}`;
  }
}

export class OtherParam extends TypeFilterParam {
  value: string;
  constructor(elem: string, value?: string) {
    super(elem);
    this.value = value ?? '';
  }
  public render() {
    return (
      <Card pl="sm" pr="sm" mt="sm" mb="sm" pt="xs" pb="xs" shadow="none" withBorder>
        <Group grow align="center">
          <Title fw={600} order={5}>
            <Text c="blue.9" inherit span pr="sm">
              {this.elementName}
            </Text>
            <Text inherit span>
              =
            </Text>
          </Title>
          <TextInput
            onChange={event => (this.value = event.currentTarget.value)}
            placeholder="Filter value"
            defaultValue={this.value}
          />
        </Group>
      </Card>
    );
  }
  public toTypeFilterString() {
    if (this.value === '') return '';

    return `${this.elementName}=${this.value.trim()}`;
  }
}
