import fs from 'fs';
import path from 'path';
import TypeParamsMultiSelect from './type-params-multiselect';

export default async function TypeParamsPage() {
  const typesData = await getTypesForDropdown();
  return <TypeParamsMultiSelect data={typesData} />;
}

async function getTypesForDropdown() {
  const filePath = path.join(process.cwd(), 'data', 'choice-types.json');
  const jsonData = await fs.promises.readFile(filePath);
  const data = JSON.parse(jsonData.toString());
  return Object.keys(data);
}
