'use client';
import { BulkExportResponse } from '@/app/export-execution/page';
import { Button, Center, Group, Title, Collapse, Tooltip, Stack, Divider } from '@mantine/core';
import { useEffect, useState } from 'react';
import { filesize } from 'filesize';
import { IconDownload } from '@tabler/icons-react';

export interface FileSizeNameUrl {
  name: string;
  url: string;
  size: number;
}

export interface FileDownloadCollapseProps {
  files: BulkExportResponse[];
  opened: boolean;
}

export default function FileDownloadCollapse({ files, opened }: FileDownloadCollapseProps) {
  const [fileSizeData, setFileSizeData] = useState<FileSizeNameUrl[]>([]);
  const [totalFileSize, setTotalFileSize] = useState<number>(0);

  const noFilesFound = files.length === 0;

  useEffect(() => {
    let totalFileBytes = 0;
    Promise.all(
      files.map(file =>
        fetch(file.url)
          .then(response => response.blob())
          .then(data => {
            const fileSizeData: FileSizeNameUrl = { name: file.type, size: data.size, url: file.url };

            totalFileBytes += data.size;

            return fileSizeData;
          })
      )
    )
      .then(fileSizes => {
        setFileSizeData(fileSizes);
        setTotalFileSize(totalFileBytes);
      })
      .catch(error => console.error('Error:', error));
  }, []);

  return (
    <>
      <Collapse in={opened}>
        <Stack>
          {fileSizeData.map((file, index) => {
            return (
              <>
                <Group justify="space-between" key={`group ${index}`}>
                  <Title order={4} key={`title ${index}`}>
                    {file.name}
                  </Title>
                  <Button
                    component="a"
                    href={file.url}
                    key={`button ${index}`}
                    rightSection={<IconDownload size={14} />}
                    w={225}
                  >
                    Download ({filesize(file.size)})
                  </Button>
                </Group>
                <Divider key={`divider ${index}`}></Divider>
              </>
            );
          })}
          {noFilesFound ? <Center>No Files Found...</Center> : <></>}
          <Center mt="lg">
            <Tooltip label="Not yet implemented...">
              <Button size="lg" rightSection={<IconDownload size={24} />} disabled={true}>
                Download All Files ({filesize(totalFileSize)})
              </Button>
            </Tooltip>
          </Center>
        </Stack>
      </Collapse>
    </>
  );
}
