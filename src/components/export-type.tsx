"use client";

import { Center, Grid, Paper, rem, Stack, Title } from "@mantine/core";

import classes from "./componentStyles/export-type.module.css";
import GroupDropdown from "./groupDropdown";
import { useState } from "react";
import PatientDropdown from "./patientDropdown";
import BuildQueryButton from "./build-query-button";
import { capitalizeFirstLetter } from "../util/string-utility-functions";

export type SupportedExportTypes = "patient" | "group" | "system";

export default function ExportType({ name }: { name: SupportedExportTypes }) {
  const [queryId, setQueryId] = useState<string | null>("");

  return (
    <Grid.Col span={{ base: 12, md: 6, lg: 3 }} style={{ minWidth: rem(600) }}>
      <Paper shadow="xl" radius="xl" p="xl">
        <Stack className={classes.card}>
          <Center>
            <Title className={classes.title}>
              {`${capitalizeFirstLetter(name)}-level Export`}
            </Title>
          </Center>
          {renderDropdown(name, setQueryId)}
          <BuildQueryButton queryId={queryId} dropdown={name} />
        </Stack>
      </Paper>
    </Grid.Col>
  );
}

function renderDropdown(
  dropdownType: SupportedExportTypes,
  getQueryIdFromDropdown: (a: string | null) => void
) {
  if (dropdownType === "patient") {
    return <PatientDropdown setPatientId={getQueryIdFromDropdown} />;
  } else if (dropdownType === "group") {
    return <GroupDropdown setGroupId={getQueryIdFromDropdown} />;
  } else {
    return <></>;
  }
}
