import { sortBy, uniq } from 'lodash';
import { PropertyPaths } from 'fhir-spec-tools';

export const allSupportedElements = sortBy(uniq(Object.values(PropertyPaths.parsedPropertyPaths).flat()));
