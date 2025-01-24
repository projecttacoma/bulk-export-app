'use client';

import { organizeOutputByPatientState } from '@/state/organize-output-by-patient-state';
import { Switch } from '@mantine/core';
import { useRecoilState } from 'recoil';

export default function OrganizeOutputByPatientSwitch() {
  const [organizeOutputByPatient, setOrganizeOutputByPatient] = useRecoilState(organizeOutputByPatientState);

  return (
    <Switch
      label="Add organizeOutputBy=Patient to the query string"
      onLabel="YES"
      offLabel="NO"
      size="lg"
      checked={organizeOutputByPatient}
      onChange={event => setOrganizeOutputByPatient(event.currentTarget.checked)}
    />
  );
}
