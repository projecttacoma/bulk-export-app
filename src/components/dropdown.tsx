import { SupportedExportTypes } from './export-type';
import GroupDropdown from './group-dropdown';
import PatientDropdown from './patient-dropdown';

export interface DropdownProps {
  dropdownType: SupportedExportTypes;
  getQueryIdFromDropdown: (id: string | null) => void;
}

/*
 * Wrapper component for each type of dropdown associated with each export type
 */
export default function Dropdown({ dropdownType, getQueryIdFromDropdown }: DropdownProps) {
  if (dropdownType === 'patient') {
    return <PatientDropdown setPatientId={getQueryIdFromDropdown} />;
  } else if (dropdownType === 'group') {
    return <GroupDropdown setGroupId={getQueryIdFromDropdown} />;
  } else {
    return <></>;
  }
}
