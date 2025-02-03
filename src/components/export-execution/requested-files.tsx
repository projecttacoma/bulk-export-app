import '@mantine/code-highlight/styles.css';
import {
  Center,
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
  Text,
  Button
} from '@mantine/core';
import { IconFileDownload, IconFileSearch } from '@tabler/icons-react';
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

export interface ResourceFileInfos {
  name: string;
  url: string;
}

export interface RequestedFilesProps {
  files: BulkExportResponse[];
  opened: boolean;
}

// Component for the collapsible section with the filenames and buttons to download them.
export default function RequestedFiles({ files, opened }: RequestedFilesProps) {
  const [fileSizeData, setFileSizeData] = useState<ResourceFileInfos[]>([]);
  const [totalFileSize, setTotalFileSize] = useState(0);
  const [previewedFile, setPreviewedFile] = useState<ResourceFileInfo>();
  const [jsonModalOpened, { open, close }] = useDisclosure(false);
  const [fileDataLookup, setFileDataLookup] = useState<Record<string, ResourceFileInfo>>({});
  const [resourceInfoLoading, setResourceInfoLoading] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);

  const noFilesFound = files.length === 0;

  const retrieveInfo = (file: ResourceFileInfos) => {
    setResourceInfoLoading(prevData => ({ ...prevData, [file.name]: true }));
    let totalFileBytes = 0;
    fetch(file.url)
      .then(response => response.blob())
      .then(data => data.text())
      .then(ndjsonData => {
        const fileData: ResourceFileInfo = {
          name: file.name,
          size: ndjsonData.length,
          url: file.url,
          numResources: ndjsonData.split('\n').length,
          objectArray: parseNdjson(ndjsonData)
        };
        totalFileBytes += ndjsonData.length;
        return fileData;
      })
      .then(fileData => {
        setFileDataLookup(prevData => ({ ...prevData, [fileData.name]: fileData }));
        setTotalFileSize(totalFileSize + totalFileBytes);
        setResourceInfoLoading(prevData => ({ ...prevData, [file.name]: false }));
      });
  };

  useEffect(() => {
    setLoading(true);
    Promise.all(
      files.map(file => {
        const fileData: ResourceFileInfos = {
          name: file.type,
          url: file.url
        };
        return fileData;
      })
    )
      .then(fileData => {
        setFileSizeData(fileData);
        setLoading(false);
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
        {loading ? (
          <Center>
            <Title order={3} mr="lg" c="gray.6">
              Loading content
            </Title>
            <Loader />
          </Center>
        ) : (
          <Center>
            <Card>
              <Title order={4}>
                Total Size of Downloaded Export Files:{' '}
                <Text span inherit c="blue.9" inline>
                  {filesize(totalFileSize)}
                </Text>
              </Title>
            </Card>
          </Center>
        )}
        {fileSizeData.map(file => {
          return (
            <Card key={file.name} p="md" ml="sm" mr="sm" radius="lg" shadow="sm" withBorder>
              <Group justify="space-between">
                <Title order={3} c="dark.9">
                  {file.name}
                </Title>
                <Group>
                  {resourceInfoLoading[file.name] === true ? (
                    <Loader />
                  ) : fileDataLookup[file.name] ? (
                    <Group>
                      <Tooltip label={`Number of exported "${file.name}" resources`} openDelay={500} withArrow>
                        <Badge fz={14} size="md" variant="outline" color="dark.4">
                          {fileDataLookup[file.name].numResources}{' '}
                          {fileDataLookup[file.name].numResources === 1 ? 'Resource' : 'Resources'}
                        </Badge>
                      </Tooltip>
                      <Tooltip label="Size of exported .ndjson file" openDelay={500} withArrow>
                        <Badge fz={15} variant="light" size="lg" color="dark.6">
                          {filesize(fileDataLookup[file.name].size)}
                        </Badge>
                      </Tooltip>
                      <Tooltip label={`Preview ${file.name}.ndjson`} openDelay={500} withArrow>
                        <ActionIcon
                          size="lg"
                          radius="md"
                          color="blue.4"
                          onClick={() => {
                            setPreviewedFile(fileDataLookup[file.name]);
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
                  ) : (
                    <Button onClick={() => retrieveInfo(file)}>Load NDJSON Information</Button>
                  )}
                </Group>
              </Group>
            </Card>
          );
        })}
      </Stack>
      <Modal opened={jsonModalOpened} onClose={close} size={1000} radius="md">
        {previewedFile && <ResourceFilePreview file={previewedFile} />}
      </Modal>
    </Collapse>
  );
}
