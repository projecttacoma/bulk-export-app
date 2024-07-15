'use client';

import React from 'react';
import { RecoilRoot } from 'recoil';
import { Notifications } from '@mantine/notifications';

/*
 * Component to use Recoil Root client side and to be able to import it not using SSR
 */
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <RecoilRoot>
      <Notifications />
      {children}
    </RecoilRoot>
  );
}
