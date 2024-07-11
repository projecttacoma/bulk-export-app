/*
 * Function to parse ndjson data into an array of javascript objects
 */
function parseNdjson(ndjsonString: string): unknown[] {
  const jsonObjectArray = ndjsonString.split('\n').map(data => JSON.parse(data));

  return jsonObjectArray;
}

/*
 * Function to stringify an array of javascript objects into a string of new line delimitated
 * json strings. Default has numValues set to 1 to just json.stringify one element of the passed in array
 */
function stringifyJsonArray(jsonObjectArray: unknown[], start: number, numValues: number = 1) {
  const subset = jsonObjectArray.slice(start, start + numValues);
  const jsonStrings = subset.map(data => JSON.stringify(data, null, 2));
  const joinedJsonString = jsonStrings.join('\n');

  return joinedJsonString;
}

export { parseNdjson, stringifyJsonArray };
