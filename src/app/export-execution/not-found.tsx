import { Center, Stack, Title, Text, Button } from '@mantine/core';
import Link from 'next/link';

export default function NotFound() {
  return (
    <Center>
      <Stack>
        <Center>
          <Title>Not Found</Title>
        </Center>
        <Text>Could not find requested resource. Make sure the bulk export server is running and check the query</Text>
        <Center>
          <Button component={Link} href="/query-selector">
            Return to query selector
          </Button>
        </Center>
      </Stack>
    </Center>
  );
}
