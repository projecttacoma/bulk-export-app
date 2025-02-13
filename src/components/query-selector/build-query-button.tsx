import { Center, Tooltip, Button } from '@mantine/core';
import Link from 'next/link';
import { SupportedExportTypes } from './export-type';
import { measureBundleState } from '@/state/measure-bundle';
import { useRecoilValue } from 'recoil';

export interface BuildQueryButtonProps {
  queryId: string | null;
  exportType: SupportedExportTypes;
}

/*
 *  Component for the build query button at the bottom of each export-type component
 *  navigates to the next page, and creates the query string
 */
export default function BuildQueryButton({ queryId, exportType }: BuildQueryButtonProps) {
  const measureBundle = useRecoilValue(measureBundleState);
  const buttonEnabled =
    exportType === 'group' ? queryId !== null : exportType !== 'measure-bundle' || measureBundle.content !== null;

  return (
    <Center>
      <Tooltip
        label={
          exportType === 'group'
            ? 'Please select an ID'
            : exportType === 'measure-bundle'
              ? 'Please upload a Measure Bundle'
              : ''
        }
        disabled={buttonEnabled}
      >
        <Button
          component={Link}
          href={{
            pathname: '/query-builder',
            query: exportType !== 'group' ? { exportType: exportType } : { exportType: exportType, id: queryId }
          }}
          data-disabled={!buttonEnabled}
          onClick={event => {
            buttonEnabled ? event : event.preventDefault();
          }}
          size="lg"
        >
          Build Query
        </Button>
      </Tooltip>
    </Center>
  );
}
