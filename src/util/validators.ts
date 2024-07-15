/*
 * Validates that a server at `bulkExportServerUrl` has an operation named `export`
 */
async function validateServerHasExportOperation(bulkExportServerUrl: string) {
  const response = await fetch(bulkExportServerUrl + '/metadata');
  const data = await response.json();
  const serverOperations: object[] = data.rest[0].operation;
  const hasExportOperation = serverOperations.some(obj => 'name' in obj && obj.name === 'export');

  return hasExportOperation;
}

export { validateServerHasExportOperation };
