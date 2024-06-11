import { Select, Title } from "@mantine/core";
import classes from "./componentStyles/patient-dropdown.module.css";
import { useEffect, useState } from "react";
import { capitalizeFirstLetter } from "./util/string-utility-functions";

export default function GroupDropdown({
  label,
  setGroupId,
}: {
  label: string;
  setGroupId: (a: string | null) => void;
}) {
  const [data, setData] = useState<string[] | null>(null);
  const [error, setError] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>("");

  useEffect(() => setGroupId(selectedId));

  useEffect(() => {
    fetch("http://localhost:3000/Group")
      .then((res: Response) => {
        if (!res.ok) {
          setError(true);
          return;
        }
        return res.json();
      })
      .then((res) => {
        setData(res.map((obj: any) => obj._id));
      })
      .catch((error) => {
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
