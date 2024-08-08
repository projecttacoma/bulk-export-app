'use client';

import { Card, createTheme, MantineProvider, MultiSelect } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import React from 'react';
import { RecoilRoot } from 'recoil';

const theme = createTheme({
  components: {
    MultiSelect: MultiSelect.extend({
      defaultProps: {
        size: 'lg',
        radius: 'md',
        clearable: true,
        searchable: true,
        withScrollArea: false,
        styles: { dropdown: { maxHeight: 400, overflowY: 'auto' } },
        comboboxProps: { transitionProps: { transition: 'fade-down', duration: 200 }, offset: 0, shadow: 'lg' }
      }
    }),
    Card: Card.extend({
      defaultProps: {
        radius: 'md',
        padding: 'xl',
        shadow: 'md'
      }
    })
  }
});

/*
 * Component to use Recoil Root client side and to be able to import it not using SSR
 */
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MantineProvider theme={theme}>
      <Notifications />
      <RecoilRoot>{children}</RecoilRoot>
    </MantineProvider>
  );
}
