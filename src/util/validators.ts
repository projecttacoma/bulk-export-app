/*
 * Validates that a server at `bulkExportServerUrl` has an operation named `export`
 */
export async function validateServerHasExportOperation(bulkExportServerUrl: string) {
  const response = await fetch(bulkExportServerUrl + '/metadata');
  const capabilityStatement: fhir4.CapabilityStatement = await response.json();
  const restCapabilityStatements = capabilityStatement.rest;
  const serverHasExportOperation =
    restCapabilityStatements?.some(restCapabilityStatement =>
      restCapabilityStatement.operation?.some(restOperation => restOperation.name === 'export')
    ) ?? false;

  return serverHasExportOperation;
}

export async function getGroupDropdownData(url: string) {
  const first = await fetch(url);
  const json: fhir4.Bundle = await first.json();
  const dropdownData = json.entry?.map(entry => entry.resource?.id ?? '');
  return dropdownData;
}
