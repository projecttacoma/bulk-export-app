import { sortBy, uniq } from 'lodash';
import { ComboboxItem } from '@mantine/core';
import { MandatoryElements, PropertyPaths } from 'fhir-spec-tools';

/*
 * Function to create dropdown of elements supported on a given resource type. Mandatory elements are filtered to the end of the list.
 */
function createComboBoxData(resourceType: string) {
  return PropertyPaths.parsedPropertyPaths[resourceType]
    .map((element: string) => {
      return {
        value: element,
        disabled: MandatoryElements.mandatoryElements[resourceType].includes(element),
        label: element
      } as ComboboxItem;
    })
    .sort((a: ComboboxItem, b: ComboboxItem) => Number(a.disabled) - Number(b.disabled));
}

/*
 * Resource type data from fhir-spec-tools in a ComboBox format.
 */
const resourceTypesDropdownData: ComboboxItem[] = Object.keys(PropertyPaths.parsedPropertyPaths).map(value => {
  return {
    label: value,
    value: value
  };
});

/*
 * All supported elements across all supported resource types from fhir-spec-tools
 */
const allSupportedElements = sortBy(uniq(Object.values(PropertyPaths.parsedPropertyPaths).flat()));

export { createComboBoxData, resourceTypesDropdownData, allSupportedElements };
