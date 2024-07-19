import { atom } from 'recoil';

export interface TypeElement {
  type: string;
  elements: string[];
}

/*
 * Recoil state to manage the Type Parameters for the export request.
 */
export const activeTypeElementParamsState = atom<TypeElement[]>({
  key: 'activeTypeElementParamsState',
  default: []
});
