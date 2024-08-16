'use client';

import { Card, createTheme, MantineProvider, MultiSelect, Select } from '@mantine/core';
import { DatesProvider } from '@mantine/dates';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import React from 'react';
import { RecoilRoot } from 'recoil';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';

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
    Select: Select.extend({
      defaultProps: {
        size: 'md',
        radius: 'md',
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
      <RecoilRoot>
        <ModalsProvider>
          <Notifications />
          <DatesProvider settings={{ locale: 'en', firstDayOfWeek: 0, weekendDays: [0], timezone: 'UTC' }}>
            {children}
          </DatesProvider>
        </ModalsProvider>
      </RecoilRoot>
    </MantineProvider>
  );
}
