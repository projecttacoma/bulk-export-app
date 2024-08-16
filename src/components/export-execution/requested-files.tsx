import '@mantine/code-highlight/styles.css';
import {
  Group,
  Title,
  Collapse,
  Tooltip,
  Stack,
  ActionIcon,
  Badge,
  Card,
  Modal,
  Loader,
  Progress
} from '@mantine/core';
import { IconFileDownload, IconFileSearch } from '@tabler/icons-react';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { filesize } from 'filesize';
import ResourceFilePreview from './resource-file-preview';
import { BulkExportResponse, TelemetryDataProps } from '@/app/export-execution/page';
import { parseNdjson } from '@/util/ndjsonParsers';
import { useDisclosure } from '@mantine/hooks';
import { Resource } from 'fhir/r4';

export interface ResourceFileInfo {
  name: string;
  url: string;
  size: number;
  numResources: number;
  objectArray: Resource[];
  timeToFinish?: number;
}

export interface RequestedFilesProps {
  files: BulkExportResponse[];
  opened: boolean;
  setTelemData: Dispatch<SetStateAction<TelemetryDataProps | undefined>>;
}

// Component for the collapsible section with the filenames and buttons to download them.
export default function RequestedFiles({ files, opened, setTelemData }: RequestedFilesProps) {
  const [fileSizeData, setFileSizeData] = useState<ResourceFileInfo[]>([]);
  const [previewedFile, setPreviewedFile] = useState<ResourceFileInfo>();
  const [jsonModalOpened, { open, close }] = useDisclosure(false);

  const [loading, setLoading] = useState(false);

  const noFilesFound = files.length === 0;

  useEffect(() => {
    setLoading(true);
    let totalFileBytes = 0;
    const startAll = performance.now();
    Promise.all(
      files.map(file => {
        const startThis = performance.now();
        return fetch(file.url)
          .then(response => response.blob())
          .then(data => data.text())
          .then(ndjsonData => {
            const thisFileData: ResourceFileInfo = {
              name: file.type,
              size: ndjsonData.length,
              url: file.url,
              numResources: ndjsonData.split('\n').length,
              objectArray: parseNdjson(ndjsonData),
              timeToFinish: performance.now() - startThis
            };
            totalFileBytes += ndjsonData.length;
            setFileSizeData(previousData => [...previousData, thisFileData]);
            return thisFileData;
          });
      })
    )
      .then(fileSizes => {
        setFileSizeData(fileSizes.sort((a, b) => Number(a.name[0]) - Number(b.name[0])));
        setLoading(false);
        const endAll = performance.now();
        setTelemData({
          totalFileSize: totalFileBytes,
          numFiles: fileSizes.length,
          timeAllFiles: endAll - startAll
        } as TelemetryDataProps);
      })
      .catch(error => console.error('Error: ', error));
  }, []);

  return (
    <Collapse in={opened} mt={0}>
      <Stack gap="sm">
        {loading && <Progress animated value={fileSizeData.length * 5} transitionDuration={500} />}

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
        {fileSizeData.map(file => {
          return (
            <Card key={file.name} p="md" ml="sm" mr="sm" radius="lg" shadow="sm" withBorder>
              <Group justify="space-between">
                <Title order={3} c="dark.9">
                  {file.name}
                </Title>
                <Group>
                  <Tooltip label={`Time to download and parse data from "${file.name}" resources`}>
                    <Badge fz={14} size="md" variant="outline" color="dark.4">
                      {file.timeToFinish?.toFixed(0)}ms
                    </Badge>
                  </Tooltip>
                  <Tooltip label={`Number of exported "${file.name}" resources`}>
                    <Badge fz={14} size="md" variant="outline" color="dark.4">
                      {file.numResources} {file.numResources === 1 ? 'Resource' : 'Resources'}
                    </Badge>
                  </Tooltip>
                  <Tooltip label="Size of exported .ndjson file">
                    <Badge fz={15} variant="light" size="lg" color="dark.6">
                      {filesize(file.size)}
                    </Badge>
                  </Tooltip>
                  <Tooltip label={`Preview ${file.name}.ndjson`}>
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
                  <Tooltip label={`Download ${file.name}.ndjson`}>
                    <ActionIcon component="a" href={file.url} size="lg" radius="md">
                      <IconFileDownload />
                    </ActionIcon>
                  </Tooltip>
                </Group>
              </Group>
            </Card>
          );
        })}
        {loading && (
          <Stack align="center">
            <Loader type="dots" />
          </Stack>
        )}
      </Stack>
      <Modal opened={jsonModalOpened} onClose={close} size={1000} radius="md">
        {previewedFile && <ResourceFilePreview file={previewedFile} />}
      </Modal>
    </Collapse>
  );
}
