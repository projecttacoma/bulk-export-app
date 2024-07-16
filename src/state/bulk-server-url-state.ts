import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';

const { persistAtom } = recoilPersist();

/*
 * State for managing the bulk export server url
 */
export const bulkServerURLState = atom<string>({
  key: 'bulkServerURLState',
  default: '',
  effects: [persistAtom]
});
