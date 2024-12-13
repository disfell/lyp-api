export function isBlank(...fields: string[]) {
  const find = fields.find(field => field.trim().length <= 0)?.trim();
  return find === "";
}
