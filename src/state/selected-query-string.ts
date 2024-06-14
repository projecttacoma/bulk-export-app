import { atom } from 'recoil';

export const baseQueryStringState = atom<string | null>({
  key: 'baseQueryStringState',
  default: null
});
