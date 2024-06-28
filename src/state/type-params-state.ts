import { atom } from 'recoil';

/*
 * Recoil state to manage the Type Parameters for the export request.
 */
export const activeTypeParamsState = atom<string[]>({
  key: 'activeTypeParamsState',
  default: []
});
