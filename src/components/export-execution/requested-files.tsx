import '@mantine/code-highlight/styles.css';
import { Button, Center, Group, Title, Collapse, Tooltip, Stack, ActionIcon, Badge, Card, Modal } from '@mantine/core';
import { IconDownload, IconFileDownload, IconFileSearch } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { filesize } from 'filesize';
import ResourceFilePreview from './resource-file-preview';
import { BulkExportResponse } from '@/app/export-execution/page';
import { parseNdjson } from '@/util/ndjsonParsers';
import { useDisclosure } from '@mantine/hooks';
import { Resource } from 'fhir/r4';

export interface ResourceFileInfo {
  name: string;
  url: string;
  size: number;
  numResources: number;
  objectArray: Resource[];
}

export interface RequestedFilesProps {
  files: BulkExportResponse[];
  opened: boolean;
}

// Component for the collapsible section with the filenames and buttons to download them.
export default function RequestedFiles({ files, opened }: RequestedFilesProps) {
  const [fileSizeData, setFileSizeData] = useState<ResourceFileInfo[]>([]);
  const [totalFileSize, setTotalFileSize] = useState(0);
  const [previewedFile, setPreviewedFile] = useState<ResourceFileInfo>();
  const [jsonModalOpened, { open, close }] = useDisclosure(false);

  const noFilesFound = files.length === 0;

  useEffect(() => {
    let totalFileBytes = 0;
    Promise.all(
      files.map(file =>
        fetch(file.url)
          .then(response => response.blob())
          .then(data => data.text())
          .then(ndjsonData => {
            const fileSizeData: ResourceFileInfo = {
              name: file.type,
              size: ndjsonData.length,
              url: file.url,
              numResources: ndjsonData.split('\n').length,
              objectArray: parseNdjson(ndjsonData)
            };
            totalFileBytes += ndjsonData.length;
            return fileSizeData;
          })
      )
    )
      .then(fileSizes => {
        setFileSizeData(fileSizes);
        setTotalFileSize(totalFileBytes);
      })
      .catch(error => console.error('Error: ', error));
  }, []);

  return (
    <Collapse in={opened} mt={0}>
      <Stack gap="sm">
        {noFilesFound && (
          <>
            <Title order={2} ta="center">
              No files found...
            </Title>
            <Title order={5} mb="xl" c="gray.6" ta="center">
              No files matching query parameters were found on bulk export server.
            </Title>
          </>
        )}
        <Center>
          <Tooltip label="Not yet implemented...">
            <Button size="lg" rightSection={<IconDownload size={24} />} disabled={true}>
              Download All Files ({filesize(totalFileSize)})
            </Button>
          </Tooltip>
        </Center>
        {fileSizeData.map(file => {
          return (
            <Card key={file.name} p="md" ml="sm" mr="sm" radius="lg" shadow="sm" withBorder>
              <Group justify="space-between">
                <Title order={3} c="dark.9">
                  {file.name}
                </Title>
                <Group>
                  <Tooltip label={`Number of exported "${file.name}" resources`} openDelay={500} withArrow>
                    <Badge fz={14} size="md" variant="outline" color="dark.4">
                      {file.numResources} {file.numResources === 1 ? 'Resource' : 'Resources'}
                    </Badge>
                  </Tooltip>
                  <Tooltip label="Size of exported .ndjson file" openDelay={500} withArrow>
                    <Badge fz={15} variant="light" size="lg" color="dark.6">
                      {filesize(file.size)}
                    </Badge>
                  </Tooltip>
                  <Tooltip label={`Preview ${file.name}.ndjson`} openDelay={500} withArrow>
                    <ActionIcon
                      size="lg"
                      radius="md"
                      color="blue.4"
                      onClick={() => {
                        setPreviewedFile(file);
                        open();
                      }}
                    >
                      <IconFileSearch />
                    </ActionIcon>
                  </Tooltip>
                  <Tooltip label={`Download ${file.name}.ndjson`} openDelay={500} withArrow>
                    <ActionIcon component="a" href={file.url} size="lg" radius="md">
                      <IconFileDownload />
                    </ActionIcon>
                  </Tooltip>
                </Group>
              </Group>
            </Card>
          );
        })}
      </Stack>
      <Modal opened={jsonModalOpened} onClose={close} size="50%" radius="md">
        {previewedFile && <ResourceFilePreview file={previewedFile} />}
      </Modal>
    </Collapse>
  );
}
