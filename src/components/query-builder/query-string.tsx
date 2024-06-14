'use client';
import { baseQueryStringState } from '@/state/selected-query-string';
import { Button, Center, Input } from '@mantine/core';
import { useRecoilValue } from 'recoil';

export default function QueryString() {
  const queryString = useRecoilValue(baseQueryStringState);

  console.log('this is string: ' + queryString);
  return (
    <Center>
      <Input.Wrapper
        label="Query String"
        description="This is your generated query string. You can also paste or write your own here."
        size="xl"
      >
        <Input placeholder={queryString ?? 'null'} />
      </Input.Wrapper>
      <Button>Run Query</Button>
    </Center>
  );
}
