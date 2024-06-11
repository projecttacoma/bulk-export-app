import { Select, Title } from "@mantine/core";
import classes from "./componentStyles/patient-dropdown.module.css";
import { useEffect, useState } from "react";
import { capitalizeFirstLetter } from "./util/string-utility-functions";

export default function PatientDropdown({
  label,
  setPatientId,
}: {
  label: string;
  setPatientId: (a: string | null) => void;
}) {
  const [error, setError] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>("");

  useEffect(() => setPatientId(selectedId));
  // For now staticly generated... will change when patient endpoint exists
  const data = ["DataNotPopulated:test1", "test2", "test3", "test4", "test5"];

  return (
    <>
      {error ? (
        <Title>An error occured. Make sure the server is running.</Title>
      ) : (
        <Select
          classNames={{
            root: classes.root,
            input: classes.input,
            label: classes.label,
          }}
          label={`${capitalizeFirstLetter(label)} Id`}
          placeholder="Search for an Id"
          data={data ? data : [" "]}
          searchable
          nothingFoundMessage="Nothing found..."
          value={selectedId}
          onChange={setSelectedId}
        />
      )}
    </>
  );
}
