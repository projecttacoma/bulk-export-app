import { atom } from 'recoil';

interface MeasureBundleStateType {
  content: fhir4.Bundle | null;
  displayMap: Record<string, string>;
  fileName: string;
  isFile: boolean;
  groupText: string;
  queryText: string;
  status: 'idle' | 'accept' | 'reject';
}

/**
 * Atom tracking and controlling the value of uploaded measure bundle
 */
export const measureBundleState = atom<MeasureBundleStateType>({
  key: 'measureBundleState',
  default: {
    content: null,
    displayMap: {},
    fileName: '',
    isFile: false,
    groupText: 'No group content',
    queryText: '',
    status: 'idle'
  }
});
