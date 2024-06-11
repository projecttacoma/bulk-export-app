import { Select, Title } from "@mantine/core";
import classes from "./componentStyles/patient-dropdown.module.css";
import { useEffect, useState } from "react";

export default function GroupDropdown({
  setGroupId,
}: {
  setGroupId: (id: string | null) => void;
}) {
  const [data, setData] = useState<string[]>([""]);
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
          label={"Group Id"}
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
