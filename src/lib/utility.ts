export function parseEnumKey<T extends Record<string, string | number>>(
  enumObj: T,
  value: string | number
): keyof T {
  const key = (Object.entries(enumObj) as [keyof T, string | number][]).find(
    ([, val]) => val === value
  )?.[0];
  if (!key) {
    throw new Error(`Value ${value} not found in enum`);
  }
  return key;
}

export function calculateDuration(startDate: string | Date, endDate: string | Date): number {
  return Math.floor((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1;
}

export function uuidToNumericId(): string {
  const uuid = crypto.randomUUID();
  let numeric = '';
  for (const char of uuid.replace(/-/g, '')) {
    numeric += char.charCodeAt(0) % 10;
  }
  return numeric.slice(0, 16);
}
