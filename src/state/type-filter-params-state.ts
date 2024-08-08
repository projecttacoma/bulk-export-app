import { atom } from 'recoil';

export interface TypeFilter {
  filter: string;
  active: boolean;
}

/*
 * Recoil state to manage the Type Filter parameters.
 */
export const typeFilterParamsState = atom<TypeFilter[]>({
  key: 'typeFilterParamsState',
  default: []
});
