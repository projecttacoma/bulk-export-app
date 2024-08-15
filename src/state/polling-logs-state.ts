import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';

const { persistAtom } = recoilPersist();

export interface PollingLog {
  retryAfter: string;
  xProgress: string;
  response: Response;
  exportRequestDateTime: string;
}
/*
 * State for managing the bulk export server url
 */
export const pollingLogsState = atom<PollingLog[]>({
  key: 'pollingLogsState',
  default: [],
  effects: [persistAtom]
});
