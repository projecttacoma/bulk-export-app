import { Center, Tooltip, Button } from "@mantine/core";
import Link from "next/link";
import classes from "./componentStyles/export-type.module.css";

export default function BuildQueryButton({
  queryId,
  dropdown,
}: {
  queryId: string | null;
  dropdown: string;
}) {
  if (dropdown === "system") {
    return (
      <Center>
        <Button
          component={Link}
          href={{
            pathname: "/query-builder",
            query: { type: dropdown },
          }}
          radius="md"
          className={classes.queryButton}
        >
          Build Query
        </Button>
      </Center>
    );
  }
  return (
    <Center>
      <Tooltip label="Please select an ID" disabled={queryId ? true : false}>
        <Button
          component={Link}
          href={{
            pathname: "/query-builder",
            query: { type: dropdown, id: queryId },
          }}
          radius="md"
          className={classes.queryButton}
          data-disabled={queryId ? false : true}
          onClick={(event) => {
            queryId ? event : event.preventDefault();
          }}
        >
          Build Query
        </Button>
      </Tooltip>
    </Center>
  );
}
