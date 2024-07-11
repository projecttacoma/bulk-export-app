import { PollingLog } from '@/app/export-execution/page';
import { Title, Collapse, Group, Card, Badge, Flex } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconChevronUp, IconChevronDown } from '@tabler/icons-react';

export interface ExportStatusInfoProps {
  logs: PollingLog[];
  bulkDataCompleted: boolean;
}

// Component for the collapsible section with the polling logs
export default function ExportStatusInfo({ logs, bulkDataCompleted }: ExportStatusInfoProps) {
  const [opened, { toggle }] = useDisclosure(true);
  
  return (
    <>
      <Group onClick={toggle} justify="space-between">
        <Group align="flex-end">
          <Title>Export Status</Title>
          {bulkDataCompleted ? (
            <Badge size="xl" color="green" mb={4}>
              Ready
            </Badge>
          ) : (
            <Badge size="xl" color="blue" mb={4}>
              In Progress
            </Badge>
          )}
        </Group>
        {opened ? <IconChevronUp size={50}></IconChevronUp> : <IconChevronDown size={50}></IconChevronDown>}
      </Group>
      <Collapse in={opened}>
        {logs.map((log, index) => {
          return (
            <Card key={index} p="md" m="sm" radius="lg" withBorder>
              <Badge size="lg" variant="outline">
                Log {index + 1}
              </Badge>
              <Title order={2} ta="center" fw={600}>
                {log.xProgress}
              </Title>
              <Flex justify="flex-end">
                <Badge
                  size="xl"
                  pr={0}
                  variant="outline"
                  rightSection={
                    <Badge circle size="xl">
                      {log.retryAfter}
                    </Badge>
                  }
                >
                  Retry after
                </Badge>
              </Flex>
            </Card>
          );
        })}
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
