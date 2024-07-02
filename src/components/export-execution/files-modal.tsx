'use client';
import { FileSizeInfo, TypeUrl } from '@/app/export-execution/page';
import { Modal, Button, Center, Text, Group, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useEffect, useState } from 'react';
import { filesize } from 'filesize';

export default function FilesModal({ files }: { files: TypeUrl[] }) {
  const [opened, { open, close }] = useDisclosure(false);
  const [fileSizeData] = useState<FileSizeInfo[]>([]);
  const [totalFileSize, setTotalFileSize] = useState<number>(0);

  useEffect(() => {
    for (const file of files) {
      fetch(file.url)
        .then(response => response.blob())
        .then(data => {
          const readableFileSize = filesize(data.size, { standard: 'jedec' });
          fileSizeData.push({ name: file.type, url: file.url, size: readableFileSize });
          setTotalFileSize(data.size + totalFileSize);
        });
    }
  }, []);

  return (
    <>
      <Modal opened={opened} onClose={close} title="Requested Files" centered>
        {fileSizeData.map(file => {
          return (
            <Group justify="space-between" key={'group_' + file.name}>
              <Text component="a" href={file.url} key={file.name} td="none" fw={700}>
                {file.name}
              </Text>
              <Text key={'size_' + file.name}>{file.size}</Text>
            </Group>
          );
        })}
        <Center mt="lg">
          <Button>Download Files</Button>
        </Center>
      </Modal>
      <Center>
        <Button onClick={open}>View Requested Files</Button>
      </Center>
      <Title>Size of Exported Files: {filesize(totalFileSize)}</Title>
    </>
  );
}
