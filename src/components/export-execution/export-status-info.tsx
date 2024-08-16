import {
  Title,
  Collapse,
  Group,
  Badge,
  Tooltip,
  Accordion,
  AccordionItem,
  AccordionControl,
  AccordionPanel,
  Text
} from '@mantine/core';
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
    <AccordionItem value={log.xProgress + log.exportRequestDateTime}>
      <AccordionControl>
        <Group align="center">
          <Badge size="md" variant="outline">
            Log {index + 1}
          </Badge>
          <Title order={3} ta="center" fw={600}>
            {log.xProgress}
          </Title>
        </Group>
      </AccordionControl>
      <AccordionPanel>
        <Group gap="sm" align="flex-end">
          <Text fw={600}>Time:</Text>
          <Tooltip label="Time this export request took place">
            <Badge size="md" variant="outline" mb={1}>
              {log.exportRequestDateTime}
            </Badge>
          </Tooltip>
          <Text fw={600}>Retry After:</Text>
          <Tooltip label="Time (in seconds) to wait until next export request is sent">
            <Badge size="md" variant="outline" mb={1}>
              {log.retryAfter}s
            </Badge>
          </Tooltip>
        </Group>
      </AccordionPanel>
    </AccordionItem>
  ));

  return (
    <>
      <Group onClick={toggle} justify="space-between">
        <Group align="flex-end">
          <Title order={2}>Export Status</Title>
          {bulkDataCompleted ? (
            <Badge size="lg" color="green" mb={4}>
              Completed
            </Badge>
          ) : (
            <Badge size="lg" color="blue" mb={4}>
              In Progress
            </Badge>
          )}
        </Group>
        {opened ? <IconChevronUp size={50} /> : <IconChevronDown size={50} />}
      </Group>
      <Collapse in={opened}>
        <Accordion variant="contained">{items}</Accordion>
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
