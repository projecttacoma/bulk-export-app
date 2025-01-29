'use client';

import { organizeOutputByPatientState } from '@/state/organize-output-by-patient-state';
import { Code, Switch, Text } from '@mantine/core';
import { useRecoilState } from 'recoil';

export default function OrganizeOutputByPatientSwitch() {
  const [organizeOutputByPatient, setOrganizeOutputByPatient] = useRecoilState(organizeOutputByPatientState);

  return (
    <Switch
      label={
        <Text>
          Add <Code>organizeOutputBy=Patient</Code>to the query string?
        </Text>
      }
      onLabel="YES"
      offLabel="NO"
      size="lg"
      checked={organizeOutputByPatient}
      onChange={event => setOrganizeOutputByPatient(event.currentTarget.checked)}
    />
  );
}
