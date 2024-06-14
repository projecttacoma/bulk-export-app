'use client';
import React from 'react';
import { RecoilRoot } from 'recoil';
interface RecoilContextProps {
  children: React.ReactNode;
}

export default function RecoilContext({ children }: RecoilContextProps) {
  return <RecoilRoot>{children}</RecoilRoot>;
}
