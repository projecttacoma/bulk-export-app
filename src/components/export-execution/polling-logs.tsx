import { PollingLog } from '@/app/export-execution/page';
import { useMantineTheme, Flex, Title, Collapse, Stack, Group, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconChevronUp, IconChevronDown } from '@tabler/icons-react';

export interface PollingLogsListProps {
  logs: PollingLog[];
  bulkDataCompleted: boolean;
}

export default function PollingLogsList({ logs, bulkDataCompleted }: PollingLogsListProps) {
  const theme = useMantineTheme();
  const [opened, { toggle }] = useDisclosure(true);

  return (
    <>
      <Flex onClick={toggle}>
        <Title>Polling Logs</Title>
        {opened ? <IconChevronUp size={50}></IconChevronUp> : <IconChevronDown size={50}></IconChevronDown>}
      </Flex>
      <Collapse in={opened}>
        <Stack bg={theme.colors.gray[5]} p="xl">
          {logs.map((log, index) => {
            return (
              <Group key={index + 1} justify="center" grow bg="white" p="lg">
                <Text ta="left">Log {index + 1}</Text>
                <Text fz="xl" ta="center">
                  {log.xProgress}
                </Text>
                <Text ta="right">Retry after {log.retryAfter}s</Text>
              </Group>
            );
          })}
          {bulkDataCompleted && (
            <Text fz="xl" fw={700} ta="center" bg="white" p="lg">
              Bulk export ready
            </Text>
          )}
        </Stack>
      </Collapse>
    </>
  );
}
