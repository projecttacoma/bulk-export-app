/*
 * Validates that a server at `bulkExportServerUrl` has an operation named `export`
 */
async function validateServerHasExportOperation(bulkExportServerUrl: string) {
  const response = await fetch(bulkExportServerUrl + '/metadata');
  const capabilityStatement: fhir4.CapabilityStatement = await response.json();
  const restCapabilityStatements = capabilityStatement.rest;
  const serverHasExportOperation =
    restCapabilityStatements?.some(restCapabilityStatement =>
      restCapabilityStatement.operation?.some(restOperation => restOperation.name === 'export')
    ) ?? false;

  return serverHasExportOperation;
}


export { validateServerHasExportOperation };
