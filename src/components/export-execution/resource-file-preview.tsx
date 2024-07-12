import { Center, Pagination, ScrollArea, Title, Mark } from '@mantine/core';
import { CodeHighlight } from '@mantine/code-highlight';
import { useState } from 'react';
import { ResourceFileInfo } from './requested-files';
import { stringifyResource } from '@/util/ndjsonParsers';

import classes from '@/app/global.module.css';

export interface ResourceFilePreviewProps {
  file: ResourceFileInfo;
}

// Component for preview modal that renders the json code for each resource in a file.
export default function ResourceFilePreview({ file }: ResourceFilePreviewProps) {
  const [activePage, setPage] = useState(1);

  const numPages = file.objectArray.length;

  const code = stringifyResource(file.objectArray, activePage - 1);

  return (
    <>
      <Title order={1} mb="lg" ta="center">
        Exported <Mark className={classes.resourceTitle}>{file.name}</Mark> Resources
      </Title>
      <ScrollArea.Autosize mah={600} mx="auto" scrollbars="y" bd="1px solid gray.2" mr="lg" ml="lg">
        <CodeHighlight withCopyButton={false} code={code} language="json" />
      </ScrollArea.Autosize>
      <Center mt="xs">
        <Pagination total={numPages} value={activePage} onChange={setPage} radius="xl" size="xl" />
      </Center>
      <Title order={4} ta="center" mb="lg" mt="xs">
        Resources
      </Title>
    </>
  );
}
