"use client";
import { Grid, rem } from "@mantine/core";

import classes from "./page.module.css";
import ExportType from "../../components/export-type";

export default function querySelector() {
  return (
    <Grid
      justify="center"
      align="center"
      gutter={{ base: 5, xs: "md", md: "xl", xl: 50 }}
      style={{ margin: rem(60) }}
    >
      <ExportType name="patient"></ExportType>
      <ExportType name="group"></ExportType>
      <ExportType name="system"></ExportType>
    </Grid>
  );
}
