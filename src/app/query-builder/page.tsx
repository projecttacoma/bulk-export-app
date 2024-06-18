'use client';

import { useSearchParams } from 'next/navigation';

export default function QueryBuilder() {
  const searchParams = useSearchParams();
  const type = searchParams.get('type');
  const id = searchParams.get('id');
  return (
    <>
      {`Type: ${type}`} <br /> {`ID: ${id}`}
    </>
  );
}
