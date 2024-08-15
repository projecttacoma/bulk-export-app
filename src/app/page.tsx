'use client';

import classes from '@/app/global.module.css';
import {
  Center,
  Title,
  Mark,
  TextInput,
  Button,
  Tooltip,
  Stepper,
  StepperStep,
  StepperCompleted,
  Group,
  Select,
  Stack,
  Text
} from '@mantine/core';
import { useField } from '@mantine/form';
import { useRecoilState } from 'recoil';
import { bulkServerURLState } from '@/state/bulk-server-url-state';
import { validateServerHasExportOperation } from '@/util/validators';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconCircleCheckFilled, IconExclamationMark, IconInfoCircle, IconX } from '@tabler/icons-react';
import { useState } from 'react';
import Link from 'next/link';
import { GroupDropdown } from '@/components/group-dropdown';

export type SupportedExportTypes = 'group' | 'system' | 'patient';

export default function HomePage() {
  const [bulkServerUrl, setBulkExportURL] = useRecoilState(bulkServerURLState);
  const [activeStep, setActiveStep] = useState(0);
  const [urlValid, setUrlValid] = useState(false);
  const [exportType, setExportType] = useState<SupportedExportTypes>('system');
  const [queryId, setQueryId] = useState<string | null>(null);

  const field = useField({
    initialValue: bulkServerUrl,
    validate: async url => {
      notifications.clean();
      setUrlValid(false);

      const serverUrlValid = await validateBulkServerURL(url);

      if (!serverUrlValid) {
        return 'Server not detected. Check URL';
      } else {
        setUrlValid(serverUrlValid);
        setBulkExportURL(url);
      }
    },
    onValueChange: () => setUrlValid(false)
  });

  const nextStep = () => setActiveStep(current => (current < 3 ? current + 1 : current));
  const prevStep = () => setActiveStep(current => (current > 0 ? current - 1 : current));

  return (
    <>
      <Title className={classes.titlePageTitle}>bulk-export-app</Title>
      <Title className={classes.titlePageSubtitle} mt="md">
        Build an interactive <Mark className={classes.blueText}>bulk-export-server</Mark> query.
      </Title>
      <Center mt="5%" mb="xs">
        <Stepper
          size="lg"
          active={activeStep} // change this to active step
          onStepClick={value => {
            if (urlValid) setActiveStep(value);
          }}
        >
          <StepperStep label="Select server location" description="Input a url for a location of a bulk export server">
            <Stack>
              <Center>
                <TextInput
                  size="lg"
                  radius="sm"
                  w={650}
                  label="Bulk export server location"
                  placeholder="http://example.com"
                  withAsterisk
                  {...field.getInputProps()}
                  leftSection={
                    <Tooltip
                      withArrow
                      multiline
                      radius="sm"
                      position="left"
                      w={500}
                      label="In order for this app to function, the bulk export server must be running and its URL must be specified here."
                    >
                      <IconInfoCircle />
                    </Tooltip>
                  }
                  rightSection={urlValid && <IconCircleCheckFilled color="green" />}
                />
              </Center>
              <Center>
                <Group>
                  <Button variant="outline" onClick={() => field.validate()} loading={field.isValidating}>
                    Validate server
                  </Button>
                  <Button onClick={() => nextStep()} disabled={!urlValid}>
                    Next Step
                  </Button>
                </Group>
              </Center>
            </Stack>
          </StepperStep>
          <StepperStep label="Select an export level" description="Choose 'system', 'group', or 'patient'">
            <Center>
              <Stack>
                <Select
                  required
                  allowDeselect={false}
                  w={650}
                  size="lg"
                  label="Select an export level"
                  defaultValue={exportType}
                  data={['system', 'group', 'patient']}
                  onChange={value => setExportType(value as SupportedExportTypes)}
                  leftSection={
                    <Tooltip
                      withArrow
                      multiline
                      radius="sm"
                      position="left"
                      w={500}
                      label="There are 3 export levels supported by the bulk-export-server: system, group, patient. System exports all files on the system, group exports all files associated with a given group of patient, and patient exports all files associated with patients."
                    >
                      <IconInfoCircle />
                    </Tooltip>
                  }
                />
                {exportType === 'group' && (
                  <GroupDropdown groupUrl={`${bulkServerUrl}/Group`} queryId={queryId} setQueryId={setQueryId} />
                )}
                <Group justify="center">
                  <Button variant="default" onClick={prevStep}>
                    Back
                  </Button>
                  <Tooltip
                    label="Select a group id before continuing"
                    disabled={queryId !== null || exportType !== 'group'}
                  >
                    <Button onClick={() => nextStep()} disabled={exportType === 'group' && queryId === null}>
                      Next Step
                    </Button>
                  </Tooltip>
                </Group>
              </Stack>
            </Center>
          </StepperStep>
          <StepperCompleted>
            <Stack align="center" mt="xl">
              <Text fz="xl" mb="sm" fw={500}>
                Completed, click{' '}
                <Text inherit span c="blue" fw={600}>
                  Continue to Query Builder{' '}
                </Text>
                to build a export request
              </Text>

              <Button
                size="md"
                component={Link}
                href={{
                  pathname: '/query-builder',
                  query: exportType !== 'group' ? { exportType: exportType } : { exportType: exportType, id: queryId }
                }}
              >
                Continue to Query Builder
              </Button>
              <Button variant="subtle" c="black" onClick={prevStep}>
                Back
              </Button>
            </Stack>
          </StepperCompleted>
        </Stepper>
      </Center>
    </>
  );
}

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
