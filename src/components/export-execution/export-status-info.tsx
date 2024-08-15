import { Title, Collapse, Group, Card, Badge, Flex, Tooltip } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { PollingLog } from '@/state/polling-logs-state';
import { IconChevronUp, IconChevronDown } from '@tabler/icons-react';

export interface ExportStatusInfoProps {
  logs: PollingLog[];
  bulkDataCompleted: boolean;
}

// Component for the collapsible section with the polling logs
export default function ExportStatusInfo({ logs, bulkDataCompleted }: ExportStatusInfoProps) {
  const [opened, { toggle }] = useDisclosure(true);

  const items = logs.map((log, index) => (
    <Card key={index} p="md" m="sm" radius="lg" withBorder>
      <Group justify="space-between">
        <Badge size="lg" variant="outline">
          Log {index + 1}
        </Badge>
        <Tooltip label="Time this export request took place">
          <Badge size="lg" variant="outline">
            {log.exportRequestDateTime}
          </Badge>
        </Tooltip>
      </Group>
      <Title order={2} ta="center" fw={600}>
        {log.xProgress}
      </Title>
      <Flex justify="flex-end">
        <Tooltip label="Time (in seconds) to wait until next export request is sent">
          <Badge
            size="lg"
            pr={0}
            variant="outline"
            rightSection={
              <Badge circle size="lg">
                {log.retryAfter}
              </Badge>
            }
          >
            Retry after
          </Badge>
        </Tooltip>
      </Flex>
    </Card>
  ));

  return (
    <>
      <Group onClick={toggle} justify="space-between">
        <Group align="flex-end">
          <Title>Export Status</Title>
          {bulkDataCompleted ? (
            <Badge size="xl" color="green" mb={4}>
              Completed
            </Badge>
          ) : (
            <Badge size="xl" color="blue" mb={4}>
              In Progress
            </Badge>
          )}
        </Group>
        {opened ? <IconChevronUp size={50} /> : <IconChevronDown size={50} />}
      </Group>
      <Collapse in={opened}>
        {items}
        {logs.length === 0 && (
          <>
            <Title order={2} ta="center">
              No logs
            </Title>
            <Title order={5} ta="center" c="gray.6">
              Bulk export files ready
            </Title>
          </>
        )}
      </Collapse>
    </>
  );
}
