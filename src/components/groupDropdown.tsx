import { Select, Title } from '@mantine/core';
import classes from './componentStyles/patient-dropdown.module.css';
import { useEffect, useState } from 'react';

export interface GroupDropdownProps {
  setGroupId: (id: string | null) => void;
}

export default function GroupDropdown({ setGroupId }: GroupDropdownProps) {
  const [data, setData] = useState<string[]>([]);
  const [error, setError] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>('');

  useEffect(() => setGroupId(selectedId));

  // try to change this to be SSG
  useEffect(() => {
    fetch('http://localhost:3000/Group')
      .then(res => {
        if (!res.ok) {
          setError(true);
          return;
        }
        return res.json() as Promise<fhir4.Group[]>;
      })
      .then(res => {
        setData(res?.map(obj => obj.id ?? '') ?? []);
      })
      .catch(error => {
        console.error(error);
        setError(true);
      });
  }, []);

  return (
    <>
      {error ? (
        <Title>An error occured. Make sure the server is running.</Title>
      ) : (
        <Select
          classNames={{
            root: classes.root,
            input: classes.input,
            label: classes.label
          }}
          size="lg"
          radius="lg"
          label={'Group Id'}
          placeholder="Search for an Id"
          data={data}
          searchable
          nothingFoundMessage="Nothing found..."
          value={selectedId}
          onChange={setSelectedId}
        />
      )}
    </>
  );
}
