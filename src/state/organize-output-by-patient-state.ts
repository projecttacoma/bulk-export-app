import { atom } from 'recoil';

/**
 * Recoil state to set the value of organizeInputByPatient atom to true or false
 */
export const organizeOutputByPatientState = atom<boolean>({ key: 'organizeOutputByPatientState', default: false });
