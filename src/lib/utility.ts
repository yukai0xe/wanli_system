export function parseEnumKey<T>(enumObj: T, value: any): keyof T | undefined {
  return (Object.entries(enumObj) as [keyof T, any][]).find(([, val]) => val === value)?.[0];
}

export function calculateDuration(startDate: string | Date, endDate: string | Date): number {
  return Math.floor((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1;
}
