'use client';

import classes from '@/app/global.module.css';
import { Center, Title, Mark, TextInput, Button, Tooltip } from '@mantine/core';
import { useField } from '@mantine/form';
import { useSetRecoilState } from 'recoil';
import { bulkServerURLState } from '@/state/bulk-server-url-state';
import { useRouter } from 'next/navigation';
import { validateServerHasExportOperation } from '@/util/validators';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconExclamationMark, IconInfoCircle, IconX } from '@tabler/icons-react';

async function validateBulkServerURL(url: string) {
  let hasExportOperation: boolean;
  try {
    hasExportOperation = await validateServerHasExportOperation(url);
  } catch (error) {
    notifications.show({
      title: 'Server Connection Error',
      message: `Could not connect to bulk-export-server at: ${url}`,
      icon: <IconX />,
      color: 'red',
      autoClose: false
    });
    return false;
  }

  hasExportOperation
    ? notifications.show({
        title: 'Successful Server Connection',
        message: `Successfully connected to bulk-export-server at: ${url}`,
        icon: <IconCheck />,
        color: 'green'
      })
    : notifications.show({
        title: 'Potential Error',
        message: `bulk-export-server at: ${url} has no named '$export' operation in compatibility statement.`,
        icon: <IconExclamationMark />,
        autoClose: false
      });

  return true;
}

export default function HomePage() {
  const router = useRouter();
  const setBulkExportURL = useSetRecoilState(bulkServerURLState);

  const field = useField({
    initialValue: `${process.env.NEXT_PUBLIC_HOST}:${process.env.NEXT_PUBLIC_PORT}`,
    validate: async url => {
      notifications.clean();

      const serverUrlValid = await validateBulkServerURL(url);

      if (serverUrlValid) {
        setBulkExportURL(url);
        router.push('/query-selector');
      } else {
        return 'Server not detected. Check URL';
      }
    }
  });

  return (
    <>
      <Title className={classes.titlePageTitle}>bulk-export-app</Title>
      <Title className={classes.titlePageSubtitle} mt="md">
        Build an interactive <Mark className={classes.blueText}>bulk-export-server</Mark> query.
      </Title>

      <Center mt="10%" mb="xs">
        <TextInput
          size="xl"
          radius="sm"
          w={650}
          label="Bulk export server location"
          placeholder="http://example.com"
          withAsterisk
          {...field.getInputProps()}
          rightSection={
            <Tooltip
              withArrow
              multiline
              radius="sm"
              position="right"
              w={500}
              label="In order for this app to function, the bulk export server must be running and its URL must be specified here."
            >
              <IconInfoCircle />
            </Tooltip>
          }
        />
      </Center>
      <Center>
        <Button
          onClick={field.validate}
          disabled={!field.getValue()}
          radius="sm"
          size="lg"
          color=""
          loading={field.isValidating}
        >
          Continue to Query Builder
        </Button>
      </Center>
    </>
  );
}
