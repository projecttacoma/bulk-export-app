import { Select } from '@mantine/core';
import classes from './componentStyles/patient-dropdown.module.css';
import { useEffect, useState } from 'react';

export interface PatientDropdownProps {
  setPatientId: (id: string | null) => void;
}

export default function PatientDropdown({ setPatientId }: PatientDropdownProps) {
  const [selectedId, setSelectedId] = useState<string | null>('');

  useEffect(() => setPatientId(selectedId));
  // For now staticly generated... will change when patient endpoint exists
  const data = ['DataNotPopulated:test1', 'test2', 'test3', 'test4', 'test5'];

  return (
    <Select
      classNames={{
        root: classes.root,
        input: classes.input,
        label: classes.label
      }}
      size="lg"
      radius="lg"
      label={'Patient Id'}
      placeholder="Search for an Id"
      data={data}
      searchable
      nothingFoundMessage="Nothing found..."
      value={selectedId}
      onChange={setSelectedId}
    />
  );
}
