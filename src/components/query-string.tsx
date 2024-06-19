'use client';

import { Input } from '@mantine/core';
import { useSearchParams } from 'next/navigation';

export default function QueryString() {
  const searchParams = useSearchParams();
  const type = searchParams.get('type');
  const id = searchParams.get('id');
  console.log(id);
  return <Input placeholder={`${type} ${id}`} />;
}
