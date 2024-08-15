import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';

const { persistAtom } = recoilPersist();

export interface ExportTiming {
  start?: number;
  end?: number;
}
/*
 * State for managing the bulk export server url
 */
export const exportTimingState = atom<ExportTiming | null>({
  key: 'exportTimingState',
  default: null,
  effects: [persistAtom]
});
