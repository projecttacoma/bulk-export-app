'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

export default function QueryBuilder() {
  return (
    <Suspense>
      <QueryBuilderContent />
    </Suspense>
  );
}

function QueryBuilderContent() {
  const searchParams = useSearchParams();
  const type = searchParams.get('type');
  const id = searchParams.get('id');
  return (
    <>
      {`Type: ${type}`} <br /> {`ID: ${id}`}
    </>
  );
}
