'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function Search() {
  const searchParams = useSearchParams();
  const type = searchParams.get('type');
  const id = searchParams.get('id');
  return (
    <>
      {`Type: ${type}`} <br /> {`ID: ${id}`}
    </>
  );
}

export default function QueryBuilder(){

    return <Suspense>
      <Search/>
    </Suspense>
}
