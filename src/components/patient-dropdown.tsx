import { Select } from '@mantine/core';
import classes from './componentStyles/patient-dropdown.module.css';
import { useEffect, useState } from 'react';

export interface PatientDropdownProps {
  setPatientId: (id: string | null) => void;
}

/*
 * Component is the selectable dropdown populated with the patient id data. Takes in a function as props
 * to be able to set id in the query string.
 */
export default function PatientDropdown({ setPatientId }: PatientDropdownProps) {
  const [data, setData] = useState<string[]>([]);
  const [error, setError] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>('');

  useEffect(() => setPatientId(selectedId));

  useEffect(() => {
    fetch('http://localhost:3000/Patient')
      .then(res => {
        if (!res.ok) {
          setError(true);
          return;
        }
        return res.json() as Promise<fhir4.Patient[]>;
      })
      .then(res => {
        setData(res?.map(obj => obj.id ?? '') ?? []);
      })
      .catch(error => {
        console.error(error);
        setError(true);
      });
  }, []);
  console.log('I have to log this', error);

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
