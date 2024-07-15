'use client';

import React from 'react';
import { RecoilRoot } from 'recoil';

/*
 * Component to use Recoil Root client side and to be able to import it not using SSR
 */
export default function Providers({ children }: { children: React.ReactNode }) {
  return <RecoilRoot>{children}</RecoilRoot>;
}
