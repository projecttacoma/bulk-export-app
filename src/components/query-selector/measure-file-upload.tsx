import { Center, Text } from '@mantine/core';
import { Dropzone, DropzoneProps } from '@mantine/dropzone';
import { showNotification } from '@mantine/notifications';
import { IconAlertCircle, IconFileCheck, IconFileImport } from '@tabler/icons-react';
import { useState } from 'react';
// import { bulkQueries } from '@/util/fqm-bulk-utils/src';

interface MeasureFileUploadProps extends Partial<DropzoneProps> {
  onQueryIdChange: (queryId: string | null) => void;
}

export default function MeasureFileUpload({ onQueryIdChange, ...props }: MeasureFileUploadProps) {
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [dropStatus, setDropStatus] = useState<'idle' | 'accept' | 'reject'>('idle');
  // const [queriesResult, setQueriesResult] = useState<string | null>(null);
  const [queryId, setQueryId] = useState<string | null>(null);


  const handleFileRead = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const jsonContent = JSON.parse(reader.result as string);
        setFileContent(JSON.stringify(jsonContent, null, 2));
        setDropStatus('accept');

       //TODO: need to use fqm-bulk-utils and pass in  reader.result
       // then whatever is returned set that as the newQueryId
       const newQueryId = '!measure-bundle-string-goes-here!'; 
       onQueryIdChange(newQueryId);

      } catch (error) {
        setDropStatus('reject');
        showNotification({
          id: 'invalid-json',
          icon: <IconAlertCircle />,
          title: 'Invalid JSON',
          message: 'The uploaded file is not valid JSON.',
          color: 'red',
        });
      }
    };
    reader.readAsText(file);
  };

  // const handleBundleProcessing = async (bundle: any) => {
  //   try {
  //     const queries = await bulkQueries(bundle);
  //     setQueriesResult(JSON.stringify(queries, null, 2));
  //   } catch (error) {
  //     console.error('Error processing bundle:', error);
  //     showNotification({
  //       id: 'bundle-processing-error',
  //       icon: <IconAlertCircle />,
  //       title: 'Processing Error',
  //       message: 'An error occurred while processing the bundle.',
  //       color: 'red',
  //     });
  //   }
  // };

  return (
    <Dropzone
      onDrop={(files) => {
        setDropStatus('accept');
        handleFileRead(files[0]);
      }}
      onReject={() => setDropStatus('reject')}
      accept={['application/json']}
      multiple={false}
      {...props}
      styles={{
        root: {
          cursor: 'pointer',
          border: `2px dashed ${
            dropStatus === 'accept'
              ? 'var(--mantine-color-green-6)'
              : dropStatus === 'reject'
              ? 'var(--mantine-color-red-6)'
              : 'var(--mantine-color-dimmed)'
          }`,
          borderRadius: 7,
          padding: 30,
          transition: 'border-color 0.2s ease',
        },
      }}
    >
      <Center style={{ paddingBottom: 10 }}>
        {dropStatus === 'accept' && (
          <IconFileCheck size={52} color='var(--mantine-color-green-6)' stroke={1.5} />
        )}
        {dropStatus === 'reject' && (
          <IconAlertCircle size={52} color='var(--mantine-color-red-6)' stroke={1.5} />
        )}
        {dropStatus === 'idle' && (
          <IconFileImport size={52} color='var(--mantine-color-dimmed)' stroke={1.5} />
        )}
      </Center>
      <Text ta='center' size='l' inline c={dropStatus === 'accept' ? 'green' : ''}>
        Drag Measure Bundle JSON file here
      </Text>
      <Text ta='center' size='sm' c={dropStatus === 'accept' ? 'green' : 'dimmed'} inline mt={7}>
        or click to select file
      </Text>
      {/* {fileContent && (
        <>
          <Text ta='center' mt={20} fw={700}>
            Processing Bundle...
          </Text>
          {handleBundleProcessing(JSON.parse(fileContent))}
        </>
      )}
      {queriesResult && (
        <Text ta='center' mt={20} style={{ whiteSpace: 'pre-wrap' }}>
          {queriesResult}
        </Text>
      )} */}
    </Dropzone>
  );
}
