import { sortBy, uniq } from 'lodash';
import { PropertyPaths } from 'fhir-spec-tools';

export const allSupportedElements = sortBy(
  uniq(
    Object.keys(PropertyPaths.parsedPropertyPaths)
      .map(resource => PropertyPaths.parsedPropertyPaths[resource])
      .flat()
  )
) as string[];
