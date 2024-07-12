import { Resource } from 'fhir/r4';

/*
 * Function to parse ndjson data into an array of Fhir4 Resources
 */
function parseNdjson(ndjsonString: string): Resource[] {
  return ndjsonString.split('\n').map(data => JSON.parse(data));
}

/*
 * Function to stringify a single element of an array of Fhir4 Resources
 */
function stringifyResource(jsonObjectArray: Resource[], resourceIndex: number) {
  return JSON.stringify(jsonObjectArray[resourceIndex], null, 2);
}

export { parseNdjson, stringifyResource };
