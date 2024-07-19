'use client';

import { MultiSelect, Stack, Title, Tooltip } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import { useRecoilState } from 'recoil';
import { resourceTypes } from '../../../data/supportedResources';
import { activeTypeParamsState } from '@/state/type-params-state';

import classes from '@/app/global.module.css';

const typeParamsHelpText = `Selected items are added to "_type" parameter of the bulk export request.
   The "_type" parameter is used to select which resource types' data you want to export. By default,
   data for all resource types is returned if a "_type" query is not provided in the export request.`;

/*
 * Component that is the content for the TypeParams tab of the query-builder page.
 */
export default function TypeParamsPage() {
  const [typeParams, setTypeParams] = useRecoilState(activeTypeParamsState);
  return (
    <Stack gap="lg">
      <Title order={2}>Type Parameter Selection</Title>
      <MultiSelect
        className={classes.MultiSelectStyles}
        label="Select Types"
        placeholder="Search for types"
        nothingFoundMessage="No types matching search found."
        hidePickedOptions
        data={resourceTypes}
        value={typeParams}
        onChange={setTypeParams}
        leftSection={
          <Tooltip
            multiline
            position="right"
            w={500}
            withArrow
            transitionProps={{ duration: 200 }}
            zIndex={400}
            label={typeParamsHelpText}
          >
            <IconInfoCircle />
          </Tooltip>
        }
      />
    </Stack>
  );
}
