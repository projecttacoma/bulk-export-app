import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { SupportedExportTypes } from './export-type';
import { Notification } from '@mantine/core';
import { Select } from '@mantine/core';
import { capitalize } from 'lodash';

export interface DropdownProps {
  dropdownType: SupportedExportTypes;
  getQueryIdFromDropdown: (id: string | null) => void;
}

/*
 * Component to display the dropdown associated with each export type component
 */
export default function Dropdown({ dropdownType, getQueryIdFromDropdown }: DropdownProps) {
  const [data, setData] = useState<string[]>([]);
  const [error, setError] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>('');

  useEffect(() => getQueryIdFromDropdown(selectedId));

  if (dropdownType === 'patient') {
    useEffect(() => {
      getPatientDropdownData(setData, setError);
    }, []);
  } else if (dropdownType === 'group') {
    useEffect(() => {
      getGroupDropdownData(setData, setError);
    }, []);
  } else {
    return <></>;
  }

  if (error) {
    return (
      <Notification color="red" title="Error">
        An Error occured fetching dropdown data. Make sure bulk-data-server is running.
      </Notification>
    );
  }

  return (
    <Select
      size="lg"
      radius="lg"
      label={`${capitalize(dropdownType)} Id`}
      placeholder="Search for an Id"
      data={data}
      searchable
      nothingFoundMessage="Nothing found..."
      value={selectedId}
      onChange={setSelectedId}
    />
  );
}

/*
 * Get data from bulk export server for the group dropdown
 * Note: could be done with getStaticProps eventually if necessary
 */
function getGroupDropdownData(
  setData: Dispatch<SetStateAction<string[]>>,
  setError: Dispatch<SetStateAction<boolean>>
) {
  const host = process.env.NEXT_PUBLIC_HOST;
  const port = process.env.NEXT_PUBLIC_PORT;

  fetch(`${host}:${port}/Group`)
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
}
/*
 * Get data from bulk export server for the patient dropdown
 * Note: could be done with getStaticProps eventually if necessary
 *       Currently this data is filler beacuse there is no patient endpoint to get the data
 */
function getPatientDropdownData(
  setData: Dispatch<SetStateAction<string[]>>,
  setError: Dispatch<SetStateAction<boolean>>
) {
  setData(['DataNotPopulated:test1', 'test2', 'test3', 'test4', 'test5']);
  console.log(setError);
}
