import { getGroupDropdownData } from '@/util/validators';
import { Select } from '@mantine/core';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';

export function GroupDropdown({
  groupUrl,
  queryId,
  setQueryId
}: {
  groupUrl: string;
  queryId: string | null;
  setQueryId: Dispatch<SetStateAction<string | null>>;
}) {
  const [dropdownData, setDropdownData] = useState<string[]>();

  useEffect(() => {
    getGroupDropdownData(groupUrl)
      .then(data => setDropdownData(data))
      .catch(e => console.error(e));
  }, []);

  return (
    <Select
      required
      allowDeselect={false}
      size="lg"
      radius="md"
      label="Select a Group Id"
      description="Specify a group of patients to export files related to those patients"
      placeholder="Search for an Id"
      data={dropdownData}
      searchable
      onClear={() => setQueryId(null)}
      nothingFoundMessage="Nothing found..."
      value={queryId}
      onChange={setQueryId}
    />
  );
}
