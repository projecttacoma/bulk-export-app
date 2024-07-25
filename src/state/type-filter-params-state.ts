import { atom } from 'recoil';

/*
 * Recoil state to manage the Type Filter parameters.
 */
export const activeTypeFilterParamsState = atom<string[]>({
  key: 'activeTypeFilterParamsState',
  default: []
});
