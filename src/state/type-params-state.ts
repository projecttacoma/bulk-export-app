import { atom } from 'recoil';

export const activeTypeParamsState = atom<string[]>({
  key: 'activeTypeParamsState',
  default: []
});