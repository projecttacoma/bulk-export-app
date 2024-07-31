import { atom } from 'recoil';

/*
 * Recoil state to manage the Element Parameters for the export request.
 */
export const activeElementParamsState = atom<string[]>({
  key: 'activeElementParamsState',
  default: []
});
