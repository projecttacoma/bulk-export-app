import { Select, TextInput, Text, Title, Card, Group } from '@mantine/core';
import { DateValue, DateTimePicker } from '@mantine/dates';

export abstract class TypeFilterParam {
  elementName: string;

  constructor(element: string) {
    this.elementName = element;
  }
  abstract render(): React.ReactElement;
  abstract toTypeFilterString(): string;
}

export class DateTimeParam extends TypeFilterParam {
  compare: string;
  date: DateValue;
  comparators?: Array<'eq' | 'ne' | 'gt' | 'lt' | 'ge' | 'le' | 'sa' | 'eb' | 'ap'>;
  constructor(
    elem: string,
    compare: string,
    date: DateValue,
    comparators?: Array<'eq' | 'ne' | 'gt' | 'lt' | 'ge' | 'le' | 'sa' | 'eb' | 'ap'>
  ) {
    super(elem);
    this.compare = compare;
    this.date = date;
    this.comparators = comparators;
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
          <Group grow>
            <DateTimePicker
              valueFormat="DD MMM YYYY hh:mm A"
              defaultValue={this.date}
              size="md"
              radius="md"
              onChange={value => (this.date = value)}
              placeholder="Pick date and time"
            />
            <Select
              defaultValue={this.compare}
              allowDeselect={false}
              radius="md"
              size="md"
              data={this.comparators}
              onChange={value => (this.compare = value ?? '')}
            />
          </Group>
        </Group>
      </Card>
    );
  }
  public toTypeFilterString() {
    return `${this.elementName}=${this.compare} ${this.date?.toString()}`;
  }
}

export class OtherParam extends TypeFilterParam {
  value: string;
  constructor(elem: string, value: string) {
    super(elem);
    this.value = value;
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
    return `${this.elementName}=${this.value.trim()}`;
  }
}
