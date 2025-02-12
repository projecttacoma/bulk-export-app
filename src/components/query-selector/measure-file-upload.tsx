import { Center, Text } from '@mantine/core';
import { Dropzone, DropzoneProps } from '@mantine/dropzone';
import { showNotification } from '@mantine/notifications';
import { IconAlertCircle, IconFileCheck, IconFileImport } from '@tabler/icons-react';
import { bulkQueries } from 'fqm-bulk-utils';
import { useState } from 'react';

interface MeasureFileUploadProps extends Partial<DropzoneProps> {
  onQueryIdChange: (queryId: string | null) => void;
}

export default function MeasureFileUpload({ onQueryIdChange, ...props }: MeasureFileUploadProps) {
  const [dropStatus, setDropStatus] = useState<'idle' | 'accept' | 'reject'>('idle');
  const [fileName, setFileName] = useState<string | null>(null);

  const rejectUpload = (message: string) => {
    setDropStatus('reject');
    showNotification({
      icon: <IconAlertCircle />,
      title: 'Bundle upload failed',
      message: `There was an issue uploading your bundle: ${message}`,
      color: 'red'
    });
  };

  const handleFileRead = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const bundle = JSON.parse(reader.result as string) as fhir4.Bundle;

        // check to see if its a bundle
        const measures = bundle.entry?.filter(r => r?.resource?.resourceType === 'Measure');
        if (bundle.resourceType !== 'Bundle') {
          rejectUpload('Uploaded file must be a JSON FHIR Resource of type "Bundle"');
          return;
        } else if (!measures || measures.length !== 1) {
          rejectUpload('Uploaded bundle must contain exactly one resource of type "Measure"');
          return;
        }

        handleBundleProcessing(bundle);
        setFileName(file.name);
      } catch (error) {
        setDropStatus('reject');
        showNotification({
          id: 'invalid-json',
          icon: <IconAlertCircle />,
          title: 'Invalid JSON',
          message: 'The uploaded file is not valid JSON.',
          color: 'red'
        });
      }
    };
    reader.readAsText(file);
  };

  const handleBundleProcessing = async (bundle: fhir4.Bundle) => {
    try {
      const queries = await bulkQueries(bundle);
      onQueryIdChange(queries);
      setDropStatus('accept');
    } catch (error) {
      console.error('Error processing bundle:', error);
      showNotification({
        id: 'bundle-processing-error',
        icon: <IconAlertCircle />,
        title: 'Processing Error',
        message: 'An error occurred while processing the bundle.',
        color: 'red'
      });
    }
  };

  return (
    <Dropzone
      onDrop={files => {
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
          transition: 'border-color 0.2s ease'
        }
      }}
    >
      <Center style={{ paddingBottom: 10 }}>
        {dropStatus === 'accept' && <IconFileCheck size={52} color="var(--mantine-color-green-6)" stroke={1.5} />}
        {dropStatus === 'reject' && <IconAlertCircle size={52} color="var(--mantine-color-red-6)" stroke={1.5} />}
        {dropStatus === 'idle' && <IconFileImport size={52} color="var(--mantine-color-dimmed)" stroke={1.5} />}
      </Center>
      {fileName ? (
        <Text ta="center" size="l" inline c={'green'}>
          {fileName}
        </Text>
      ) : (
        <>
          <Text ta="center" size="l" inline>
            Drag Measure Bundle JSON file here
          </Text>
          <Text ta="center" size="sm" c={'dimmed'} inline mt={7}>
            or click to select file
          </Text>
        </>
      )}
    </Dropzone>
  );
}
