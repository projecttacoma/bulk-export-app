import { Center, Stack, Title } from '@mantine/core';

export default function Loading() {
  return (
    <Stack>
      <Center>
        <Title>Bulk export Kickoff request is being processed...</Title>
      </Center>
      <Center>
        <Title order={3} c="gray">
          This is just a test for now.
        </Title>
      </Center>
    </Stack>
  );
}
